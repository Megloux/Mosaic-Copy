// src/data/exercises.ts

// Define the Exercise type
interface Exercise {
    id: string;
    exercise_name: string;
    category_id: string;
    setup_instructions: string;
    movement_notes: string;
    cueing: string;
    this_that: string;
    spring_setup: {
        light_springs: number;
        heavy_springs: number;
    };
    template_tags: string[];
    vimeo_id: string;
    standard_time: string;
}

// Abs exercises (category_id: "c1")
const abs_exercises = {
    e1: {
        id: "e1",
        exercise_name: "ModifiedPlank",
        category_id: "c1",
        setup_instructions: "Start in forearm plank position with knees down",
        movement_notes: "Maintain neutral spine, engage core",
        cueing: "Draw navel to spine, keep shoulders stable",
        this_that: "Should feel work in deep core muscles",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e2: {
        id: "e2",
        exercise_name: "HighPlank",
        category_id: "c1",
        setup_instructions: "Start in full plank position on hands",
        movement_notes: "Keep body in straight line from head to heels",
        cueing: "Stack shoulders over wrists, engage core",
        this_that: "Should feel work in shoulders and core, not lower back",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e3: {
        id: "e3",
        exercise_name: "PlankCrunch",
        category_id: "c1",
        setup_instructions: "Start in plank position on forearms",
        movement_notes: "Draw knees toward chest while maintaining plank",
        cueing: "Keep hips level, control the movement",
        this_that: "Should feel work in lower abs and hip flexors",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e4: {
        id: "e4",
        exercise_name: "PlankToPike",
        category_id: "c1",
        setup_instructions: "Begin in plank position",
        movement_notes: "Pike hips up and back while maintaining straight legs",
        cueing: "Push through shoulders, keep core engaged",
        this_that: "Should feel stretch in hamstrings and work in shoulders",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e5: {
        id: "e5",
        exercise_name: "BodySaw",
        category_id: "c1",
        setup_instructions: "Start in forearm plank on carriage",
        movement_notes: "Slide carriage back and forth while maintaining plank",
        cueing: "Keep body rigid, control the movement",
        this_that: "Should feel intense core stabilization",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e6: {
        id: "e6",
        exercise_name: "Wheelbarrow",
        category_id: "c1",
        setup_instructions: "Start in plank position with feet in straps",
        movement_notes: "Control carriage movement while maintaining plank",
        cueing: "Keep hips level, engage core throughout",
        this_that: "Should feel core stabilization and shoulder work",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e7: {
        id: "e7",
        exercise_name: "Cobra",
        category_id: "c1",
        setup_instructions: "Lie prone on carriage, hands by shoulders",
        movement_notes: "Press through hands to lift chest, keeping hips down",
        cueing: "Draw shoulder blades together, engage core",
        this_that: "Should feel work in upper back and core stability",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e8: {
        id: "e8",
        exercise_name: "HighBarPlankCrunch",
        category_id: "c1",
        setup_instructions: "Plank position holding high bar with hands",
        movement_notes: "Draw knees to chest while maintaining plank",
        cueing: "Keep shoulders engaged, control movement",
        this_that: "Should feel deep core activation and shoulder stability",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e9: {
        id: "e9",
        exercise_name: "Boomerang",
        category_id: "c1",
        setup_instructions: "Side-lying position on carriage",
        movement_notes: "Create circular movement pattern with legs",
        cueing: "Maintain core stability throughout movement",
        this_that: "Should feel work in obliques and hip control",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e10: {
        id: "e10",
        exercise_name: "KneelingPikeNeutral",
        category_id: "c1",
        setup_instructions: "Start in kneeling position facing tower",
        movement_notes: "Pike hips back maintaining neutral spine",
        cueing: "Keep core engaged, move from hips",
        this_that: "Should feel deep core activation",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e11: {
        id: "e11",
        exercise_name: "KneelingCrunchFlexion",
        category_id: "c1",
        setup_instructions: "Kneel facing tower, hands behind head",
        movement_notes: "Curl torso forward maintaining kneeling position",
        cueing: "Initiate movement from abdominals",
        this_that: "Should feel focused work in upper abdominals",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Export both the type and the data
export { Exercise, abs_exercises };
// Continue in the same file after abs_exercises...

const obliques_exercises = {
    e12: {
        id: "e12",
        exercise_name: "SidePlank",
        category_id: "c2",
        setup_instructions: "Side-lying on forearm, stack shoulders and hips",
        movement_notes: "Lift hips creating straight line through body",
        cueing: "Keep body aligned, shoulders stacked",
        this_that: "Should feel work in side body and core",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e13: {
        id: "e13",
        exercise_name: "Teaser",
        category_id: "c2",
        setup_instructions: "Lie supine on carriage, legs extended",
        movement_notes: "Roll up to V-sit position with control",
        cueing: "Keep spine curved, legs straight",
        this_that: "Should feel deep core integration",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e14: {
        id: "e14",
        exercise_name: "SnakeTwistedPlankToPike",
        category_id: "c2",
        setup_instructions: "Start in plank position with rotation",
        movement_notes: "Move through twisted pike pattern",
        cueing: "Control rotation while maintaining stability",
        this_that: "Should feel oblique engagement and shoulder stability",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e15: {
        id: "e15",
        exercise_name: "TwistedPlankCrunch",
        category_id: "c2",
        setup_instructions: "Plank position with rotational element",
        movement_notes: "Add cross-body knee drive to opposite elbow",
        cueing: "Maintain plank while adding rotation",
        this_that: "Should feel oblique and cross-body connection",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e16: {
        id: "e16",
        exercise_name: "TwistedSaw",
        category_id: "c2",
        setup_instructions: "Start in rotated plank position",
        movement_notes: "Add saw motion while maintaining rotation",
        cueing: "Keep rotation stable during movement",
        this_that: "Should feel deep oblique and core connection",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e17: {
        id: "e17",
        exercise_name: "ObliquePikeNeutral",
        category_id: "c2",
        setup_instructions: "Side-lying pike position",
        movement_notes: "Maintain neutral spine during side pike",
        cueing: "Move from lateral core, keep spine long",
        this_that: "Should feel work in side body and obliques",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e18: {
        id: "e18",
        exercise_name: "ObliqueCrunchFlexion",
        category_id: "c2",
        setup_instructions: "Side-lying with lateral flexion",
        movement_notes: "Add side crunch movement pattern",
        cueing: "Initiate from obliques, control movement",
        this_that: "Should feel focused oblique work",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e19: {
        id: "e19",
        exercise_name: "Mermaid",
        category_id: "c2",
        setup_instructions: "Side-sitting on carriage",
        movement_notes: "Create lateral flexion with arm reach",
        cueing: "Keep hips grounded, reach through crown",
        this_that: "Should feel length in side body",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e20: {
        id: "e20",
        exercise_name: "TorsoTwist",
        category_id: "c2",
        setup_instructions: "Seated facing side, hold straps",
        movement_notes: "Rotate torso maintaining upright position",
        cueing: "Initiate from core, keep hips stable",
        this_that: "Should feel rotational core work",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e21: {
        id: "e21",
        exercise_name: "ChopsAndSwings",
        category_id: "c2",
        setup_instructions: "Stand facing side, hold strap",
        movement_notes: "Create diagonal chopping pattern",
        cueing: "Move from core, control momentum",
        this_that: "Should feel diagonal core connection",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Export both the type and the data
export { Exercise, abs_exercises, obliques_exercises };
const lower_body_lsd_exercises = {
    e22: {
        id: "e22",
        exercise_name: "FloorLunge",
        category_id: "c4",
        setup_instructions: "Standing on floor facing carriage",
        movement_notes: "Step back into lunge position",
        cueing: "Keep front knee stacked, back heel lifted",
        this_that: "Should feel work in front leg quad and glute",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e23: {
        id: "e23",
        exercise_name: "PlatformLunge",
        category_id: "c4",
        setup_instructions: "Standing on platform facing away",
        movement_notes: "Step forward into lunge position",
        cueing: "Control carriage movement, maintain alignment",
        this_that: "Should feel work in front leg quad and hip flexor",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e24: {
        id: "e24",
        exercise_name: "CarriageLunge",
        category_id: "c4",
        setup_instructions: "Standing on carriage facing platform",
        movement_notes: "Control carriage movement in lunge pattern",
        cueing: "Keep torso upright, control the carriage",
        this_that: "Should feel work in both legs equally",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e25: {
        id: "e25",
        exercise_name: "LateralLunge",
        category_id: "c4",
        setup_instructions: "Standing sideways on carriage",
        movement_notes: "Step out to side into lateral lunge",
        cueing: "Keep working leg straight, bend standing knee",
        this_that: "Should feel work in inner thigh and lateral hip",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e26: {
        id: "e26",
        exercise_name: "PowerLunge",
        category_id: "c4",
        setup_instructions: "Standing on carriage in lunge position",
        movement_notes: "Add power element to lunge pattern",
        cueing: "Control power phase, soft landing",
        this_that: "Should feel explosive power in legs",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e27: {
        id: "e27",
        exercise_name: "SquatLightResistance",
        category_id: "c4",
        setup_instructions: "Standing on carriage facing back",
        movement_notes: "Perform squat pattern with light resistance",
        cueing: "Keep weight in heels, knees track toes",
        this_that: "Should feel work in quads and glutes",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e28: {
        id: "e28",
        exercise_name: "BridgeSeriesLightResistance",
        category_id: "c4",
        setup_instructions: "Lying supine on carriage, feet on platform",
        movement_notes: "Perform bridge series with light resistance",
        cueing: "Press through heels, engage glutes",
        this_that: "Should feel work in hamstrings and glutes",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e29: {
        id: "e29",
        exercise_name: "InnerThighSeries",
        category_id: "c4",
        setup_instructions: "Side-lying on carriage, bottom leg extended",
        movement_notes: "Perform inner thigh strengthening series",
        cueing: "Keep hips stacked, engage inner thigh",
        this_that: "Should feel focused work in adductors",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e30: {
        id: "e30",
        exercise_name: "DeadliftProgressions",
        category_id: "c4",
        setup_instructions: "Standing on carriage facing back",
        movement_notes: "Progress through deadlift patterns",
        cueing: "Hinge at hips, maintain neutral spine",
        this_that: "Should feel work in posterior chain",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e31: {
        id: "e31",
        exercise_name: "SquatWithRow",
        category_id: "c4",
        setup_instructions: "Standing on carriage, holding straps",
        movement_notes: "Combine squat with rowing motion",
        cueing: "Coordinate squat with row, maintain form",
        this_that: "Should feel integration of lower body and back",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e32: {
        id: "e32",
        exercise_name: "WellKicks",
        category_id: "c4",
        setup_instructions: "Standing at well, facing side",
        movement_notes: "Perform controlled leg kicks",
        cueing: "Maintain stable standing leg, control kicks",
        this_that: "Should feel work in standing leg and kicking leg",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    }
};

// Add to exports
export { Exercise, abs_exercises, obliques_exercises, lower_body_lsd_exercises };
const lower_body_heavy_exercises = {
    e33: {
        id: "e33",
        exercise_name: "RunningMan",
        category_id: "c3",
        setup_instructions: "Standing on carriage, facing back",
        movement_notes: "Alternate leg pressing pattern",
        cueing: "Drive through heel, control return",
        this_that: "Should feel work in pressing leg glute and quad",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e34: {
        id: "e34",
        exercise_name: "ScooterKick",
        category_id: "c3",
        setup_instructions: "Standing on carriage sideways",
        movement_notes: "Press carriage out in kicking motion",
        cueing: "Keep standing leg stable, control kick",
        this_that: "Should feel work in standing leg and kicking leg",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e35: {
        id: "e35",
        exercise_name: "DonkeyKickExternalRotation",
        category_id: "c3",
        setup_instructions: "All fours on carriage, working leg externally rotated",
        movement_notes: "Press leg back maintaining rotation",
        cueing: "Keep hips level, maintain external rotation",
        this_that: "Should feel work in glute and external rotators",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e36: {
        id: "e36",
        exercise_name: "SpiderKickExternalRotation",
        category_id: "c3",
        setup_instructions: "Plank position, working leg externally rotated",
        movement_notes: "Press leg back from plank",
        cueing: "Maintain plank position, control leg movement",
        this_that: "Should feel work in glute and core stability",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e37: {
        id: "e37",
        exercise_name: "SideLyingLegPressHighBar",
        category_id: "c3",
        setup_instructions: "Side-lying, foot on high bar",
        movement_notes: "Press leg while maintaining side-lying position",
        cueing: "Keep hips stacked, press through heel",
        this_that: "Should feel work in outer hip and thigh",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e38: {
        id: "e38",
        exercise_name: "SuperLungeHeavy",
        category_id: "c3",
        setup_instructions: "Standing in lunge position with heavy resistance",
        movement_notes: "Perform deep lunge pattern",
        cueing: "Control depth, maintain alignment",
        this_that: "Should feel intense work in both legs",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e39: {
        id: "e39",
        exercise_name: "SquatHeavy",
        category_id: "c3",
        setup_instructions: "Standing on carriage with heavy resistance",
        movement_notes: "Perform squat pattern",
        cueing: "Keep weight in heels, control depth",
        this_that: "Should feel intense work in quads and glutes",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e40: {
        id: "e40",
        exercise_name: "SkaterKick",
        category_id: "c3",
        setup_instructions: "Standing sideways, working leg crossed behind",
        movement_notes: "Press leg in skating motion",
        cueing: "Control cross-body movement, maintain balance",
        this_that: "Should feel work in outer hip and thigh",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e41: {
        id: "e41",
        exercise_name: "StandingSideKickExternalRotation",
        category_id: "c3",
        setup_instructions: "Standing sideways, working leg externally rotated",
        movement_notes: "Press leg out maintaining rotation",
        cueing: "Keep standing leg stable, maintain rotation",
        this_that: "Should feel work in hip rotators and stabilizers",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e42: {
        id: "e42",
        exercise_name: "StandingOuterThighs",
        category_id: "c3",
        setup_instructions: "Standing sideways at bar",
        movement_notes: "Press leg out to side",
        cueing: "Keep hips level, press through heel",
        this_that: "Should feel work in outer thigh and hip",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e43: {
        id: "e43",
        exercise_name: "BungeeKick",
        category_id: "c3",
        setup_instructions: "Standing facing side with bungee",
        movement_notes: "Kick leg with bungee resistance",
        cueing: "Control kick and return, maintain alignment",
        this_that: "Should feel work throughout leg",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e44: {
        id: "e44",
        exercise_name: "BridgeSeriesHeavy",
        category_id: "c3",
        setup_instructions: "Lying supine, feet on platform, heavy resistance",
        movement_notes: "Perform bridge series",
        cueing: "Press through heels, maintain pelvic control",
        this_that: "Should feel intense work in hamstrings and glutes",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e45: {
        id: "e45",
        exercise_name: "Superhero",
        category_id: "c3",
        setup_instructions: "Standing facing back, arms in superhero position",
        movement_notes: "Press carriage while maintaining arm position",
        cueing: "Keep upper body stable, press through legs",
        this_that: "Should feel full body integration",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "2:00"
    }
};

// Add to exports
export { Exercise, abs_exercises, obliques_exercises, lower_body_lsd_exercises, lower_body_heavy_exercises };
// Upper Body Exercises
const upper_body_exercises = {
    e46: {
        id: "e46",
        exercise_name: "SexyBack",
        category_id: "c6",
        setup_instructions: "Standing facing back, holding straps",
        movement_notes: "Pull straps with back engagement",
        cueing: "Draw shoulder blades together, maintain posture",
        this_that: "Should feel work in upper back and shoulders",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e47: {
        id: "e47",
        exercise_name: "ChestOpener",
        category_id: "c6",
        setup_instructions: "Standing facing forward, arms open",
        movement_notes: "Open arms against resistance",
        cueing: "Keep chest lifted, control movement",
        this_that: "Should feel stretch in chest, work in upper back",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e48: {
        id: "e48",
        exercise_name: "Newspaper",
        category_id: "c6",
        setup_instructions: "Standing facing back, arms forward",
        movement_notes: "Pull straps apart like opening newspaper",
        cueing: "Keep shoulders down, open through chest",
        this_that: "Should feel work in back and shoulders",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e49: {
        id: "e49",
        exercise_name: "LatPulldown",
        category_id: "c6",
        setup_instructions: "Standing facing back, arms overhead",
        movement_notes: "Pull straps down engaging lats",
        cueing: "Keep core engaged, pull from back",
        this_that: "Should feel work in latissimus dorsi",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e50: {
        id: "e50",
        exercise_name: "KneelingBicepCurl",
        category_id: "c6",
        setup_instructions: "Kneeling facing back, arms extended",
        movement_notes: "Perform bicep curl with straps",
        cueing: "Keep elbows still, curl from biceps",
        this_that: "Should feel focused work in biceps",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e51: {
        id: "e51",
        exercise_name: "OverheadTricepExtension",
        category_id: "c6",
        setup_instructions: "Standing facing forward, arms overhead",
        movement_notes: "Extend arms against resistance",
        cueing: "Keep elbows by ears, extend from triceps",
        this_that: "Should feel focused work in triceps",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e52: {
        id: "e52",
        exercise_name: "HugATree",
        category_id: "c6",
        setup_instructions: "Standing facing back, arms wide",
        movement_notes: "Draw arms together in hugging motion",
        cueing: "Keep shoulders down, engage chest",
        this_that: "Should feel work in chest and arms",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e53: {
        id: "e53",
        exercise_name: "ServePlatter",
        category_id: "c6",
        setup_instructions: "Standing facing side, arms in serving position",
        movement_notes: "Move arms in serving motion",
        cueing: "Control movement, engage shoulders",
        this_that: "Should feel work in shoulders and arms",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e54: {
        id: "e54",
        exercise_name: "Superman",
        category_id: "c6",
        setup_instructions: "Standing facing back, arms extended",
        movement_notes: "Pull straps while maintaining extension",
        cueing: "Keep arms straight, engage back",
        this_that: "Should feel work in entire back",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    }
};
    e60: {
        id: "e55",
        exercise_name: "FacePull",
        category_id: "c6",
        setup_instructions: "Standing facing back, arms at shoulder height",
        movement_notes: "Pull straps towards face with external rotation",
        cueing: "Draw elbows wide, rotate palms back",
        this_that: "Should feel work in rear deltoids and rotator cuff",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    }
// Lower Body Straps Exercises
const lower_body_straps_exercises = {
    e55: {
        id: "e56",
        exercise_name: "BirdDog",
        category_id: "c5",
        setup_instructions: "All fours with feet in straps",
        movement_notes: "Alternate leg extensions",
        cueing: "Keep hips level, maintain core stability",
        this_that: "Should feel work in core and legs",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e56: {
        id: "e57",
        exercise_name: "Crane",
        category_id: "c5",
        setup_instructions: "Prone position, feet in straps",
        movement_notes: "Lift and lower legs with control",
        cueing: "Keep pelvis stable, engage hamstrings",
        this_that: "Should feel work in hamstrings and glutes",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e57: {
        id: "e58",
        exercise_name: "FrogKickObliqueSweep",
        category_id: "c5",
        setup_instructions: "Prone position, feet in straps",
        movement_notes: "Combine frog kick with oblique movement",
        cueing: "Control diagonal movement, keep core engaged",
        this_that: "Should feel work in inner thighs and obliques",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e58: {
        id: "e59",
        exercise_name: "SidePlankWithLegLifts",
        category_id: "c5",
        setup_instructions: "Side plank position, top foot in strap",
        movement_notes: "Lift and lower leg while maintaining plank",
        cueing: "Keep hips stacked, lift from outer hip",
        this_that: "Should feel work in outer hip and core",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e59: {
        id: "e60",
        exercise_name: "SideLyingLegSweep",
        category_id: "c5",
        setup_instructions: "Side-lying, top leg in strap",
        movement_notes: "Sweep leg forward and back",
        cueing: "Keep hips stable, control movement",
        this_that: "Should feel work in hip flexors and glutes",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: [],
        vimeo_id: "",
        standard_time: "1:30"
    }
};

// Add to exports
export { 
    Exercise, 
    abs_exercises, 
    obliques_exercises, 
    lower_body_lsd_exercises, 
    lower_body_heavy_exercises,
    upper_body_exercises,
    lower_body_straps_exercises 
};
