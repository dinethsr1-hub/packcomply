require("dotenv").config();
const express=require("express"), multer=require("multer"), OpenAI=require("openai");
const app=express(), upload=multer({storage:multer.memoryStorage(),limits:{fileSize:8*1024*1024}});
app.use(express.json());
app.get("/", (req, res) => {
  res.redirect("/index.html");
});
const RULES=require('./rules.json');
const client=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;

app.post("/api/inspect",upload.single("photo"),async(req,res)=>{
  if(!req.file) return res.status(400).json({error:"No photo uploaded"});
  if(!client) return res.json({mode:"demo",inspection:{
    packaging_type:"Flexible pouch",likely_material:"Plastic / multilayer (unverified)",
    material_confidence:"low",food_contact_likelihood:"likely",
    visible_text:[],visible_symbols:[],net_weight:null,suspected_layers:[],
    possible_issues:["Exact polymer/layer structure cannot be verified from a photo.","Food-contact compliance cannot be established from appearance alone."],
    missing_information:["Material specification","Packaging weight","Food-contact Declaration of Compliance where applicable"],
    cannot_determine:["Polymer composition","Migration compliance","Recyclability classification"],confidence:"low"
  }});
  try{
    const b64=req.file.buffer.toString("base64"), mime=req.file.mimetype;
    const response=await client.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-6-luna",
      input:[{role:"user",content:[
        {type:"input_text",text:`Inspect this packaging photo as a preliminary packaging-compliance assistant. Do not claim legal compliance. Return JSON only with keys: packaging_type, likely_material, material_confidence, food_contact_likelihood, visible_text (array), visible_symbols (array), net_weight, suspected_layers (array), possible_issues (array), missing_information (array), cannot_determine (array), confidence. Never infer exact polymer composition, migration compliance, certification validity, or legal responsibility from appearance alone.`},
        {type:"input_image",image_url:`data:${mime};base64,${b64}`}
      ]}]
    });
    const text=response.output_text||"{}";
    let parsed; try{parsed=JSON.parse(text)}catch{parsed={raw:text}};
    res.json({mode:"live",inspection:parsed});
  }catch(e){res.status(500).json({error:e.message})}
});


app.post("/api/check", (req,res)=>{
  const x=req.body||{}, country=x.country, product=x.product, material=x.material, contact=x.food_contact;
  const matched=RULES.filter(r=>{
    const t=r.triggers||{};
    if(t.country && t.country!==country) return false;
    if(t.jurisdiction==="EU" && !["Germany","France","Netherlands"].includes(country)) return false;
    if(t.product_groups && !t.product_groups.includes(product)) return false;
    if(t.packaging_materials && !t.packaging_materials.includes(material)) return false;
    if(t.food_contact && contact!=="yes") return false;
    return true;
  });
  const evidence=[...new Set(matched.flatMap(r=>r.evidence||[]))];
  res.json({status:"preliminary_review",matched,evidence,limitations:[
    "This result is not a legal opinion or certification.",
    "Exact material composition and technical conformity cannot be established from a photograph alone.",
    "Country-specific applicability depends on the user's legal/supply-chain role and packaging classification."
  ]});
});

module.exports = app;
