// src/data/core/variations.ts

// Define the Variation type
export interface Variation {
    id: string;
    variation_name: string;
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

// TempoChange variations (category_id: "v1")
const tempo_change_variations = {
    v1: {
        id: "v1",
        variation_name: "PowerRound",
        category_id: "v1",
        setup_instructions: "Maintain standard exercise position",
        movement_notes: "Perform exercise with powerful, explosive movement on concentric phase",
        cueing: "Explode up, control down",
        this_that: "Should feel increased power generation and muscle recruitment",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["power", "explosive"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v2: {
        id: "v2",
        variation_name: "CAndE",
        category_id: "v1",
        setup_instructions: "Maintain standard exercise position",
        movement_notes: "Contract for 3 counts, extend for 3 counts",
        cueing: "Slow control, feel each phase",
        this_that: "Should feel increased time under tension in both phases",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["tempo", "control"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    v3: {
        id: "v3",
        variation_name: "OneFourTempo",
        category_id: "v1",
        setup_instructions: "Maintain standard exercise position",
        movement_notes: "One count on concentric phase, four counts on eccentric phase",
        cueing: "Quick up, slow down with control",
        this_that: "Should feel increased eccentric control and muscle engagement",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["tempo", "eccentric"],
        vimeo_id: "",
        standard_time: "0:45"
    }
};

// ExerciseVariations variations (category_id: "v2")
const exercise_variations = {
    v4: {
        id: "v4",
        variation_name: "SplitSquat",
        category_id: "v2",
        setup_instructions: "One foot forward, one foot back in split stance",
        movement_notes: "Lower into split squat position while maintaining alignment",
        cueing: "Keep front knee over ankle, back knee toward floor",
        this_that: "Should feel work in front quad and glute, back hip flexor stretch",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["lower_body", "unilateral"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v5: {
        id: "v5",
        variation_name: "RunnersLunge",
        category_id: "v2",
        setup_instructions: "One foot forward in lunge position, back leg extended",
        movement_notes: "Lower into deep lunge position with back heel lifted",
        cueing: "Stay low, maintain hip alignment",
        this_that: "Should feel deep stretch in hip flexors and work in quads",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["lower_body", "mobility"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v6: {
        id: "v6",
        variation_name: "StaticHold",
        category_id: "v2",
        setup_instructions: "Move to most challenging position of exercise",
        movement_notes: "Hold position with minimal movement",
        cueing: "Breathe through the hold, maintain engagement",
        this_that: "Should feel increased isometric contraction and stability",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["isometric", "endurance"],
        vimeo_id: "",
        standard_time: "0:30"
    },
    v7: {
        id: "v7",
        variation_name: "Hinge",
        category_id: "v2",
        setup_instructions: "Stand with feet hip-width apart",
        movement_notes: "Bend forward from hips while maintaining flat back",
        cueing: "Push hips back, keep chest lifted",
        this_that: "Should feel stretch in hamstrings and work in posterior chain",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["lower_body", "posterior_chain"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v8: {
        id: "v8",
        variation_name: "Twist",
        category_id: "v2",
        setup_instructions: "Maintain stable base position",
        movement_notes: "Add rotational movement to standard exercise",
        cueing: "Rotate from core, keep hips stable",
        this_that: "Should feel work in obliques and increased core engagement",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["rotation", "core"],
        vimeo_id: "",
        standard_time: "0:45"
    }
};

// Grip variations (category_id: "v3")
const grip_variations = {
    v9: {
        id: "v9",
        variation_name: "Pronate",
        category_id: "v3",
        setup_instructions: "Turn palms down/forward",
        movement_notes: "Maintain pronated grip throughout exercise",
        cueing: "Keep palms facing down, engage forearms",
        this_that: "Should feel increased work in forearm extensors and different shoulder engagement",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["grip", "upper_body"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v10: {
        id: "v10",
        variation_name: "Supinate",
        category_id: "v3",
        setup_instructions: "Turn palms up/backward",
        movement_notes: "Maintain supinated grip throughout exercise",
        cueing: "Keep palms facing up, engage biceps",
        this_that: "Should feel increased work in biceps and forearm flexors",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["grip", "upper_body"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v11: {
        id: "v11",
        variation_name: "WideArms",
        category_id: "v3",
        setup_instructions: "Position hands wider than shoulder-width",
        movement_notes: "Maintain wide arm position throughout exercise",
        cueing: "Keep arms wide, engage chest and shoulders",
        this_that: "Should feel increased work in outer chest and shoulders",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["grip", "upper_body"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v12: {
        id: "v12",
        variation_name: "TripodArms",
        category_id: "v3",
        setup_instructions: "Position hands in tripod grip (thumb and first two fingers)",
        movement_notes: "Maintain tripod grip throughout exercise",
        cueing: "Engage through fingertips, maintain wrist alignment",
        this_that: "Should feel increased work in forearm stabilizers and grip strength",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["grip", "stability"],
        vimeo_id: "",
        standard_time: "0:45"
    }
};

// Stance variations (category_id: "v4")
const stance_variations = {
    v13: {
        id: "v13",
        variation_name: "ToesTurnedOut",
        category_id: "v4",
        setup_instructions: "Position feet with toes turned outward",
        movement_notes: "Maintain external rotation from hips",
        cueing: "Rotate from hips, keep knees tracking over toes",
        this_that: "Should feel increased work in inner thighs and glute medius",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["stance", "lower_body"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v14: {
        id: "v14",
        variation_name: "Staggered",
        category_id: "v4",
        setup_instructions: "Position one foot slightly ahead of the other",
        movement_notes: "Maintain staggered stance throughout exercise",
        cueing: "Keep weight evenly distributed, maintain alignment",
        this_that: "Should feel increased stability challenge and core engagement",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["stance", "balance"],
        vimeo_id: "",
        standard_time: "0:45"
    },
    v15: {
        id: "v15",
        variation_name: "WideFeet",
        category_id: "v4",
        setup_instructions: "Position feet wider than hip-width apart",
        movement_notes: "Maintain wide stance throughout exercise",
        cueing: "Press through outer edges of feet, engage inner thighs",
        this_that: "Should feel increased work in inner thighs and different glute engagement",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["stance", "lower_body"],
        vimeo_id: "",
        standard_time: "0:45"
    }
};

// ComboMoves variations (category_id: "v5")
const combo_moves_variations = {
    v16: {
        id: "v16",
        variation_name: "SquatToRow",
        category_id: "v5",
        setup_instructions: "Standing position holding straps",
        movement_notes: "Combine squat with rowing movement",
        cueing: "Squat down, row on the way up",
        this_that: "Should feel full body integration of lower and upper body",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["combo", "full_body"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    v17: {
        id: "v17",
        variation_name: "LungeWithTwist",
        category_id: "v5",
        setup_instructions: "Lunge position with rotation capability",
        movement_notes: "Combine lunge with torso rotation",
        cueing: "Lunge down, rotate toward front leg",
        this_that: "Should feel work in legs and obliques",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["combo", "rotation"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    v18: {
        id: "v18",
        variation_name: "BicepCurlToPress",
        category_id: "v5",
        setup_instructions: "Standing position holding straps",
        movement_notes: "Combine bicep curl with overhead press",
        cueing: "Curl to shoulders, press overhead",
        this_that: "Should feel work in biceps transitioning to shoulders",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["combo", "upper_body"],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Export all variation data
export {
    tempo_change_variations,
    exercise_variations,
    grip_variations,
    stance_variations,
    combo_moves_variations
};
