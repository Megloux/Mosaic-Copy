CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    structure JSONB NOT NULL,
    is_pro_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Power to Precision Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Power to Precision',
'Build power through controlled movements, focusing on form and precision in each exercise',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Warmup Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 exercises core / cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b7",
      "name": "Heavy Bilateral Warmup",
      "template_tags": ["HeavyBilateral"],
      "exercise_count": {
        "min": 1,
        "max": 1
      },
      "instructions": "Heavy bilateral warmup. Ex: Superhero, Bridge Press, Deadlifts",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Pressing Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Heavy Pressing Legs",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Footstrap Block",
      "template_tags": ["Footstrap"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Footstrap Lower Body Moves",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Light Resistance",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Light pulling/lunges/adductor work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Heavy Upper Body",
      "template_tags": ["HeavyResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Heavy Pushing or Pulling. Ex: Heavy chest press, bent over rows",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Light Cable Work",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Lighter Cable work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Bodyweight",
      "template_tags": ["Bodyweight"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Bodyweight exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending Core Block",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);

-- The OG Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'The OG',
'Classic Pilates exercises focusing on fundamental movement patterns and core stability',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 core exercises",
      "is_warmup": true,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Leg Block 1",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 Leg 1 exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Leg Block 2",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 Leg 2 exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b4",
      "name": "Oblique Block 1",
      "template_tags": ["Obliques"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "2-3 Oblique 1 exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b5",
      "name": "Oblique Block 2",
      "template_tags": ["Obliques"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "2-3 Oblique 2 exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Upper Body Block",
      "template_tags": ["UpperBody"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 Upper Body exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 3,
        "max": 5
      },
      "instructions": "3-5 ending core exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
false
);

-- Upper Body Focus Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Upper Body Focus',
'Concentrated upper body workout incorporating pressing, pulling, and stabilization',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 exercises core / cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Bilateral Warmup",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "1-2 bilateral warm up exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Heavy Upper Body",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "2-3 Heavy Pressing exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Main Upper Body Block",
      "template_tags": ["UpperBody"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending Core Block",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);

-- Lower Body Focus Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Lower Body Focus',
'Targeted lower body exercises focusing on strength, stability, and power',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 exercises core / cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Bilateral Warmup",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "1-2 bilateral warm up exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "2-3 Heavy Pressing Legs",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Footstrap Block",
      "template_tags": ["Footstrap"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "2-3 Footstrap Lower Body Moves",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Light Resistance",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "2 Light pulling/lunges/adductor work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending Core Block",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);

-- Cable/Strap Focused Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Cable/Strap Focused',
'Utilizing cables and straps for dynamic resistance training and stability work',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Cable Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 opening cable strap warm up. Ex: arm assisted cable crunches, leg circles",
      "is_warmup": true,
      "has_cardio_burst": false
    },
    {
      "block_id": "b4",
      "name": "Oblique Cable Block 1",
      "template_tags": ["Obliques"],
      "exercise_count": {
        "min": 3,
        "max": 4
      },
      "instructions": "3-4 Oblique 1 cable strap exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b5",
      "name": "Oblique Cable Block 2",
      "template_tags": ["Obliques"],
      "exercise_count": {
        "min": 3,
        "max": 4
      },
      "instructions": "3-4 Oblique 2 cable strap exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Long Black Cable Block",
      "template_tags": ["UpperBody"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "Long Black cable focused",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Leg Cable Block 1",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "3 exercises (min 1 lunge)",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Leg Cable Block 2",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "3 exercises (min 1 lunge)",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Cable Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "Cable core block",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Block",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending core block (planks/cardio bursts)",
      "is_warmup": false,
      "has_cardio_burst": true
    }
  ]
},
true
);

-- Power Round Template
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Power Round',
'High-intensity workout combining strength exercises with cardio bursts for endurance',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Core/Cardio Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 5,
        "max": 6
      },
      "instructions": "5-6 exercises core / min 2 exercises cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b7",
      "name": "Heavy Bilateral Warmup",
      "template_tags": ["HeavyBilateral"],
      "exercise_count": {
        "min": 1,
        "max": 1
      },
      "instructions": "1 Heavy bilateral warmup. Ex: Superhero, Bridge Press, Deadlifts, Squat row",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "3 heavy legs",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Power Round",
      "template_tags": ["PowerRound"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "1-2 with power round",
      "is_warmup": false,
      "has_cardio_burst": true
    },
    {
      "block_id": "b1",
      "name": "Core with Cardio",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 3,
        "max": 3
      },
      "instructions": "Core block with cardio bursts in between legs",
      "is_warmup": false,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Leg Block 2",
      "template_tags": ["LowerBody"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Leg Block 2",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Upper Body with Cardio",
      "template_tags": ["UpperBody"],
      "exercise_count": {
        "min": 5,
        "max": 5
      },
      "instructions": "5 exercises + cardio bursts",
      "is_warmup": false,
      "has_cardio_burst": true
    },
    {
      "block_id": "b1",
      "name": "Ending Core with Cardio",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending core block with min 2 cardio bursts",
      "is_warmup": false,
      "has_cardio_burst": true
    }
  ]
},
true
);

-- Stacked Templates (following Power to Precision structure with specific focus)
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Stacked - Anterior Day',
'Targeted workout for the front of the body, emphasizing chest, abs, and quads',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Anterior Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 anterior core exercises with cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Quad Focus Warmup",
      "template_tags": ["HeavyBilateral"],
      "exercise_count": {
        "min": 1,
        "max": 1
      },
      "instructions": "Heavy bilateral warmup focusing on quads. Ex: Front Squats, Step Ups",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Anterior Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Heavy anterior chain leg exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Anterior Footstrap",
      "template_tags": ["Footstrap"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Footstrap moves targeting front body",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Light Anterior Work",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Light anterior chain work - lunges, knee drives",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Heavy Chest/Shoulders",
      "template_tags": ["HeavyResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Heavy chest and shoulder focus. Ex: Chest press variations",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Light Anterior Upper Body",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Light anterior upper body work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Anterior Bodyweight",
      "template_tags": ["Bodyweight"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Bodyweight exercises targeting front body",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Anterior Core",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending core block focusing on abs and anterior chain",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);

-- Stacked - Posterior Day
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Stacked - Posterior Day',
'Focused on the back of the body, strengthening back, glutes, and hamstrings',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Posterior Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 posterior core exercises with cardio burst warm up",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Posterior Chain Warmup",
      "template_tags": ["HeavyBilateral"],
      "exercise_count": {
        "min": 1,
        "max": 1
      },
      "instructions": "Heavy bilateral warmup focusing on glutes/hamstrings. Ex: Deadlifts, Bridge Press",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Posterior Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Heavy posterior chain leg exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Posterior Footstrap",
      "template_tags": ["Footstrap"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Footstrap moves targeting back body",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Light Posterior Work",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Light posterior chain work - hamstring curls, glute work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Heavy Back/Shoulders",
      "template_tags": ["HeavyResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Heavy back and rear shoulder focus. Ex: Rows, pulls",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Light Posterior Upper Body",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Light posterior upper body work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Posterior Bodyweight",
      "template_tags": ["Bodyweight"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Bodyweight exercises targeting back body",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Posterior Core",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending core block focusing on back and posterior chain",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);

-- Stacked - Push/Pull Day
INSERT INTO templates (name, description, structure, is_pro_only) VALUES (
'Stacked - Push/Pull Day',
'Alternating push and pull movements for balanced full-body strength development',
{
  "blocks": [
    {
      "block_id": "b1",
      "name": "Core Warmup",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 4,
        "max": 5
      },
      "instructions": "5 core exercises alternating flexion/extension with cardio burst",
      "is_warmup": true,
      "has_cardio_burst": true
    },
    {
      "block_id": "b2",
      "name": "Push/Pull Warmup",
      "template_tags": ["HeavyBilateral"],
      "exercise_count": {
        "min": 1,
        "max": 1
      },
      "instructions": "Heavy bilateral warmup combining push/pull. Ex: Squat to Row",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b2",
      "name": "Heavy Push Legs",
      "template_tags": ["HeavyPressing"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Heavy pushing leg exercises",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b3",
      "name": "Pull Footstrap",
      "template_tags": ["Footstrap"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Footstrap moves emphasizing pulling motion",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b7",
      "name": "Light Push/Pull Legs",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Light leg work alternating push/pull patterns",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Heavy Push Upper Body",
      "template_tags": ["HeavyResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Heavy pushing upper body. Ex: Chest press, shoulder press",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Light Pull Upper Body",
      "template_tags": ["LightResistance"],
      "exercise_count": {
        "min": 2,
        "max": 2
      },
      "instructions": "Light pulling upper body work",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b6",
      "name": "Push/Pull Bodyweight",
      "template_tags": ["Bodyweight"],
      "exercise_count": {
        "min": 1,
        "max": 2
      },
      "instructions": "Bodyweight exercises alternating push/pull",
      "is_warmup": false,
      "has_cardio_burst": false
    },
    {
      "block_id": "b1",
      "name": "Ending Core Push/Pull",
      "template_tags": ["Core"],
      "exercise_count": {
        "min": 2,
        "max": 3
      },
      "instructions": "Ending core block alternating flexion/extension",
      "is_warmup": false,
      "has_cardio_burst": false
    }
  ]
},
true
);
