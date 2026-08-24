export const PROMPTS_PREVIEW_TEXT = `Unlock the secrets of photorealistic commercial product rendering. Our editorial team presents 10 meticulously crafted, copyable AI image-generation prompts covering famous everyday items—from luxury leather handbags and high-performance sneakers to electric hypercars and mid-century furniture. Each prompt is optimized for leading models like Flux.1 and Midjourney v6, complete with technical breakdowns of composition, lighting, materials, and specialized engine recommendations.`;

export interface ProductPrompt {
  id: string;
  name: string;
  type: string;
  variation: string;
  color: string;
  material: string;
  environment: string;
  imageUrl: string;
  prompt: string;
  generator: string;
  whySuitable: string;
}

export const PRODUCT_PROMPTS_LIST: ProductPrompt[] = [
  {
    id: "luxury-handbag",
    name: "Luxury Leather Handbag",
    type: "Fashion Accessories",
    variation: "Luxury",
    color: "Royal Emerald Green & Polished Brass",
    material: "Full-grain pebbled calfskin leather",
    environment: "High-end minimalist studio with dramatic side chiasroscuro lighting, resting on a raw travertine stone block.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    prompt: "Professional commercial product photography of a luxury emerald green pebbled leather handbag with polished gold brass clasps. Placed on a raw beige travertine stone pedestal. High-end minimalist luxury boutique setting, dramatic soft side-lighting, deep shadows, shallow depth of field, captured on a medium format Hasselblad 100MP camera, 85mm lens, f/2.8, hyper-realistic leather texture, natural reflections, ultra-high definition details.",
    generator: "Flux.1 Pro or Midjourney v6",
    whySuitable: "Flux.1 Pro excels at micro-texture reproduction, capturing the fine grains of pebbled leather and specular metallic highlights without distorting the handbag's overall geometry."
  },
  {
    id: "ergonomic-smartphone",
    name: "Sleek Ergonomic Smartphone",
    type: "Consumer Electronics",
    variation: "Budget / Value-Focused Modern",
    color: "Cobalt Matte Blue & Recycled Aluminum",
    material: "Recycled polycarbonate back shell with a bead-blasted aluminum alloy frame",
    environment: "Clean corporate desk layout, soft diffused flat-lay workspace lighting.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    prompt: "Crisp commercial flat-lay product photography of a modern sleek budget smartphone with a cobalt matte blue recycled plastic back shell and a slender metal rim. Positioned diagonally on a clean light grey textured concrete desk, accompanied by a minimalist pen and a simple blank notebook. Soft diffused desk light, perfect geometry, crisp focus, cinematic look, Fujifilm GFX 100S, f/4.0, ultra-realistic screen reflection, clean shadows.",
    generator: "Midjourney v6 or DALL-E 3",
    whySuitable: "Midjourney v6 handles flat-lay graphic arrangements and balanced color compositions with clean line-art edges exceptionally well, while keeping electronic details realistic."
  },
  {
    id: "athletic-sneakers",
    name: "High-Performance Running Sneakers",
    type: "Athletic Footwear",
    variation: "Modern Athletic",
    color: "Neon Citron & Charcoal Mesh",
    material: "Engineered woven knit mesh, translucent TPU support overlays, and a chunky ribbed carbon-fiber sole",
    environment: "Action freeze-frame suspended mid-air in a high-octane modern fitness gym or running track with dynamic lens flare.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    prompt: "Dynamic action commercial product shoot of a modern athletic running sneaker suspended mid-air above a wet charcoal running track. The sneaker is a neon citron and dark grey engineered knit mesh with reflective silver accents. Splash of water droplets frozen in time around the sole. Dramatic backlighting, lens flare, motion blur in the background, cinematic shutter speed, Sony A7R V, 35mm lens, f/2.0, photorealistic mesh weave and water droplets.",
    generator: "Flux.1 Dev",
    whySuitable: "Flux.1 Dev has outstanding physics accuracy, making it perfect for rendering suspended motion, micro-droplets of water splashing, and complex woven knit fibers."
  },
  {
    id: "acetate-sunglasses",
    name: "Classic Acetate Sunglasses",
    type: "Eyewear",
    variation: "Classic / Vintage",
    color: "Tortoiseshell with Amber Lenses",
    material: "Hand-polished organic cellulose acetate and gold metal hinges",
    environment: "Sunny Mediterranean outdoor setting, resting on a rustic terracotta ledge beside olive leaves casting dappled shadows.",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
    prompt: "Outdoor lifestyle product photography of classic tortoiseshell acetate sunglasses with warm amber polarized lenses, resting on a weathered terracotta ledge. Gentle warm Mediterranean sunlight, dappled leaf shadows dancing across the frame, a sprig of green olive leaves in the background. Soft golden hour color grading, organic rustic vibe, captured on Leica M11, 50mm Summilux lens, f/1.8, cinematic film look, natural dust particles, real glass refractions.",
    generator: "Midjourney v6",
    whySuitable: "Midjourney's cinematic film simulation engine is legendary for warm analog tones, vintage colors, and rendering natural, dappled leafy shadows with organic fidelity."
  },
  {
    id: "mechanical-watch",
    name: "Luxury Mechanical Diver Watch",
    type: "Luxury Watches",
    variation: "Premium / Elite",
    color: "Stealth Obsidian Black with Luminescent Teal Indices",
    material: "Matte sandblasted titanium casing, scratch-resistant sapphire crystal dome, and a vulcanized rubber strap",
    environment: "Submerged underwater studio scene with crisp water bubbles rising and shafts of caustic lighting filtering through the deep blue ocean.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    prompt: "Macro product photography of a premium automatic mechanical diver watch submerged in crystal-clear dark blue water. The watch features a sandblasted black titanium bezel and glowing luminescent teal indices visible under the water. Tiny air bubbles clinging to the sapphire crystal face. Sunlight caustics projecting organic wave lines across the dial. High-speed macro photography, Canon EOS R5, 100mm macro lens, f/5.6, hyper-detailed mechanics, realistic fluid dynamics.",
    generator: "Flux.1 Pro",
    whySuitable: "Flux.1 Pro produces highly accurate watch faces and complex clock numerals/ticks without garbling the alphanumeric strings or misaligning the hands."
  },
  {
    id: "organic-tote",
    name: "Organic Cotton Tote Bag",
    type: "Sustainable Carryalls",
    variation: "Minimal / Sustainable Eco-Friendly",
    color: "Natural Undyed Ecru & Sage Green Handles",
    material: "Unbleached organic heavy canvas cotton with sturdy double-stitch lining",
    environment: "Bright, airy, plant-filled sunroom hanging gently from a rustic wooden wall peg with soft daylight.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
    prompt: "Aesthetic minimalist product catalog shot of an organic cotton canvas tote bag, natural undyed ecru fabric with sage green double-stitched strap handles. Hanging from a simple oak wooden peg on a soft plaster wall. A tall fiddle-leaf fig plant stands in the soft-focus background, warm afternoon sunbeams streaming in. Clean, sustainable lifestyle aesthetic, high-key lighting, Sony A1, 55mm, f/2.2, realistic cloth weave texture, natural soft folds.",
    generator: "DALL-E 3 or Flux.1 Schnell",
    whySuitable: "DALL-E 3 excels at processing long-tail environmental context, rendering a beautiful and cozy lifestyle background while maintaining the minimal essence of the product."
  },
  {
    id: "electric-hypercar",
    name: "Electric Hypercar Concept",
    type: "Automotive",
    variation: "Luxury / Futuristic",
    color: "Liquid Platinum Metallic & Electric Purple LED lighting",
    material: "Aerodynamic carbon-fiber weave body panels and polished lightweight forged alloys",
    environment: "Rain-slicked wet streets of a high-tech modern city at midnight, glowing neon signs reflecting off the glossy bodywork.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    prompt: "Premium automotive commercial shot of a sleek electric hypercar in liquid platinum metallic paint parked on a wet asphalt street in a neon-lit cyberpunk Tokyo alleyway at night. Moody rain puddles reflecting the purple and magenta neon billboards. Dramatic low-angle perspective, headlights casting bright volumetric beams through the light mist. Photorealistic reflection mapping, hyper-detailed alloy wheels, Hasselblad H6D, f/4.0, ultra-realistic paint finish, cinematic automotive lighting.",
    generator: "Midjourney v6",
    whySuitable: "Midjourney v6 has highly refined automotive aesthetics, rendering complex metallic paint flake reflections, rain ripples, and volumetric lens flare with stunning realism."
  },
  {
    id: "noise-headphones",
    name: "Noise-Canceling Over-Ear Headphones",
    type: "Audio Equipment",
    variation: "Outdoor Lifestyle",
    color: "Sandstone Beige & Brushed Copper Accents",
    material: "Anodized aluminum ear cups, soft memory foam, and premium vegan leather",
    environment: "Resting around the neck of a stylish model standing outdoors on a misty autumn mountain trail with soft overcast lighting.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    prompt: "Close-up lifestyle portrait of a young adult model with sandstone beige noise-canceling headphones resting around their neck. The headphones feature brushed copper aluminum cups and soft vegan leather padding. Set against a breathtaking, misty mountain pine forest during autumn, soft overcast natural light. Rich cinematic color grade, shallow depth of field with creamy bokeh, capture on Nikon Z9, 85mm, f/1.4, lifelike skin texture, photorealistic headphone material details.",
    generator: "Flux.1 Dev",
    whySuitable: "Flux.1 Dev displays incredible human anatomical training, fitting complex physical products over shoulders and around hair with perfect clipping and lighting integration."
  },
  {
    id: "modern-lounge-chair",
    name: "Mid-Century Modern Lounge Chair",
    type: "Premium Furniture",
    variation: "Modern Furniture / Studio-Grade",
    color: "Burnt Orange Bouclé & Walnut Wood",
    material: "Textured tactile bouclé yarn upholstery and curved steam-bent walnut plywood base",
    environment: "Minimalist industrial loft with polished concrete floor, matte brass floor lamp, and a large architectural concrete wall window.",
    imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=800&auto=format&fit=crop",
    prompt: "Architectural Digest editorial photograph of a mid-century modern lounge chair upholstered in a rich burnt orange bouclé fabric, resting on a steam-bent walnut wood base. Positioned on a polished concrete floor in an industrial loft apartment. A sleek minimalist brass floor lamp stands alongside, cast iron details, warm dramatic evening light shining through a massive industrial window, long shadows. Ultra-realistic fabric grain, organic wood grain, high-end interior rendering, 35mm lens, f/2.8.",
    generator: "Flux.1 Pro",
    whySuitable: "Flux.1 Pro is superior at rendering interior structural straight lines, fine bent-wood veneers, and dense, realistic fabric loops like premium bouclé."
  },
  {
    id: "summer-linen-shirt",
    name: "Resort Summer Linen Shirt",
    type: "Apparel & Fashion",
    variation: "Colorful Lifestyle",
    color: "Pastel Coral, Mustard Yellow, and Sky Blue vertical resort stripes",
    material: "Lightweight, breathable open-weave pure flax linen",
    environment: "Hanging on an elegant bamboo clothes rack on a sunny resort seaside patio with the turquoise ocean waves visible in the background.",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    prompt: "Seaside lifestyle fashion photography of a colorful summer resort linen button-up shirt with vertical pastel stripes of coral, mustard yellow, and sky blue. Hanging on an elegant minimalist bamboo rack on a sun-drenched wooden deck patio overlooking a turquoise tropical ocean. Soft ocean breeze gently rustling the breathable open-weave linen fabric, creating natural light wrinkles. Golden-hour sunlight, lens flare, crisp marine air feel, Canon 1DX Mark III, f/3.2, authentic linen texture.",
    generator: "Midjourney v6",
    whySuitable: "Midjourney v6 excels at warm atmospheric beach lighting, realistic material wrinkles, and delivering professional fashion magazine editorial compositions."
  }
];
