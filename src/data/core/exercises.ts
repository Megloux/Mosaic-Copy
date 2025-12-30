// src/data/exercises.ts

// Define the Exercise type
export interface Exercise {
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
    category?: string; // Added for compatibility with component-test
    tags?: string[]; // Added for compatibility with component-test
    name?: string; // Added for compatibility with component-test
    isResistance?: boolean; // Added for compatibility with component-test
}

// Abs exercises (category_id: "c1")
const abs_exercises = {
    e1: {
        id: "e1",
        exercise_name: "ab wheel",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e2: {
        id: "e2",
        exercise_name: "body saw",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e3: {
        id: "e3",
        exercise_name: "cobra",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e4: {
        id: "e4",
        exercise_name: "plank crunch",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e5: {
        id: "e5",
        exercise_name: "plank to pike",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e6: {
        id: "e6",
        exercise_name: "high bar plank crunch",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["planks"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e7: {
        id: "e7",
        exercise_name: "arm assisted cable crunches",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["supine_cables_crunches"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e8: {
        id: "e8",
        exercise_name: "footstrap crunces",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["supine_cables_crunches"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e9: {
        id: "e9",
        exercise_name: "leg circles",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["supine_cables_crunches"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e10: {
        id: "e10",
        exercise_name: "kneeling crunch",
        category_id: "c1",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["crunches"],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Obliques exercises (category_id: "c2")
const obliques_exercises = {
    e11: {
        id: "e11",
        exercise_name: "kneeling torso twist",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e12: {
        id: "e12",
        exercise_name: "standing torso twist",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e13: {
        id: "e13",
        exercise_name: "split squat torso twist",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e14: {
        id: "e14",
        exercise_name: "oblique sweeps",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_anti_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e15: {
        id: "e15",
        exercise_name: "froggy kicks",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_anti_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e16: {
        id: "e16",
        exercise_name: "bird dogs",
        category_id: "c2",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["cables_anti_rotational"],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Lower Body LSD exercises (category_id: "c4")
const lower_body_lsd_exercises = {
    e17: {
        id: "e17",
        exercise_name: "platform lunge (front)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e18: {
        id: "e18",
        exercise_name: "platform lunge (back)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e19: {
        id: "e19",
        exercise_name: "carriage lunge (front)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e20: {
        id: "e20",
        exercise_name: "carriage lunge (back)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e21: {
        id: "e21",
        exercise_name: "floor lunge",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e22: {
        id: "e22",
        exercise_name: "power lunge",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e23: {
        id: "e23",
        exercise_name: "lateral lunge (front)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e24: {
        id: "e24",
        exercise_name: "lateral lunge (back)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e25: {
        id: "e25",
        exercise_name: "kneeling inner thighs",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["lunges_light_springs"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e26: {
        id: "e26",
        exercise_name: "Squats (Heavy)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["squats_and_deadlifts"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e27: {
        id: "e27",
        exercise_name: "Squats (Light)",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["squats_and_deadlifts"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e28: {
        id: "e28",
        exercise_name: "Deadlifts",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["squats_and_deadlifts"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e29: {
        id: "e29",
        exercise_name: "Pistol Squats",
        category_id: "c4",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 0
        },
        template_tags: ["squats_and_deadlifts"],
        vimeo_id: "",
        standard_time: "2:00"
    }
};

// Lower Body Heavy exercises (category_id: "c3")
const lower_body_heavy_exercises = {
    e30: {
        id: "e30",
        exercise_name: "Running Man",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e31: {
        id: "e31",
        exercise_name: "Skater Kick",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e32: {
        id: "e32",
        exercise_name: "Donkey Kick",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e33: {
        id: "e33",
        exercise_name: "Scooter Kick",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e34: {
        id: "e34",
        exercise_name: "Well Kick",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e35: {
        id: "e35",
        exercise_name: "Standing Side Kicks",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e36: {
        id: "e36",
        exercise_name: "Superhero",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e37: {
        id: "e37",
        exercise_name: "Bridge Press",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e38: {
        id: "e38",
        exercise_name: "Hip Thrusts",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    },
    e39: {
        id: "e39",
        exercise_name: "Split Squat with Row",
        category_id: "c3",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 1,
            heavy_springs: 1
        },
        template_tags: ["heavy_pressing"],
        vimeo_id: "",
        standard_time: "2:00"
    }
};

// Upper Body Exercises (category_id: "c6")
const upper_body_exercises = {
    e40: {
        id: "e40",
        exercise_name: "Chest Press",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["heavy_pushing"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e41: {
        id: "e41",
        exercise_name: "Tricep Press",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["heavy_pushing"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e42: {
        id: "e42",
        exercise_name: "Lat Pull",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["pulling"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e43: {
        id: "e43",
        exercise_name: "Underhand",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["pulling"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e44: {
        id: "e44",
        exercise_name: "Overhand",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["pulling"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e45: {
        id: "e45",
        exercise_name: "Overhead Press",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e46: {
        id: "e46",
        exercise_name: "Overhead Tricep Extension",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e47: {
        id: "e47",
        exercise_name: "Front Raise",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e48: {
        id: "e48",
        exercise_name: "Serve the platter",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e49: {
        id: "e49",
        exercise_name: "Newspaper",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e50: {
        id: "e50",
        exercise_name: "Chest Opener",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e51: {
        id: "e51",
        exercise_name: "Tricep Kickback",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e52: {
        id: "e52",
        exercise_name: "Reverse fly",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e53: {
        id: "e53",
        exercise_name: "Tailone face pull",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e54: {
        id: "e54",
        exercise_name: "Tailbone bicep curl",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 3,
            heavy_springs: 0
        },
        template_tags: ["long_cables"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e55: {
        id: "e55",
        exercise_name: "Bench Press",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["short_cables_heavy"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e56: {
        id: "e56",
        exercise_name: "Close Grip Press",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["short_cables_heavy"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e57: {
        id: "e57",
        exercise_name: "Chest Fly",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["short_cables_heavy"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e58: {
        id: "e58",
        exercise_name: "Bent over rows",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["short_cables_heavy"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e59: {
        id: "e59",
        exercise_name: "Squat rows",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 2
        },
        template_tags: ["short_cables_heavy"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e60: {
        id: "e60",
        exercise_name: "Tricep Kickback",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["short_cables_light"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e61: {
        id: "e61",
        exercise_name: "Chest Opener",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["short_cables_light"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e62: {
        id: "e62",
        exercise_name: "Lateral Raise",
        category_id: "c6",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["short_cables_light"],
        vimeo_id: "",
        standard_time: "1:30"
    }
};

// Cardio Bursts Exercises (category_id: "c7")
const cardio_bursts_exercises = {
    e65: {
        id: "e65",
        exercise_name: "Burpees",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e66: {
        id: "e66",
        exercise_name: "Mt Climbers",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e67: {
        id: "e67",
        exercise_name: "Pushups",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e68: {
        id: "e68",
        exercise_name: "Up/Downs",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e69: {
        id: "e69",
        exercise_name: "Army Crawls",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    },
    e70: {
        id: "e70",
        exercise_name: "Step Ups",
        category_id: "c7",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 0,
            heavy_springs: 0
        },
        template_tags: ["cardio"],
        vimeo_id: "",
        standard_time: "1:00"
    }
};

// Lower Body Straps Exercises (category_id: "c5")
const lower_body_straps_exercises = {
    e63: {
        id: "e63",
        exercise_name: "Clamshell Side planks",
        category_id: "c5",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["footstraps"],
        vimeo_id: "",
        standard_time: "1:30"
    },
    e64: {
        id: "e64",
        exercise_name: "Side lying legs",
        category_id: "c5",
        setup_instructions: "",
        movement_notes: "",
        cueing: "",
        this_that: "",
        spring_setup: {
            light_springs: 2,
            heavy_springs: 0
        },
        template_tags: ["footstraps"],
        vimeo_id: "",
        standard_time: "1:30"
    }
};

// Export all exercise data
export {
    abs_exercises,
    obliques_exercises,
    lower_body_lsd_exercises,
    lower_body_heavy_exercises,
    upper_body_exercises,
    cardio_bursts_exercises,
    lower_body_straps_exercises
};

// Create a flattened array of all exercises for component testing
export const exercisesMock: Exercise[] = [
    ...Object.values(abs_exercises),
    ...Object.values(obliques_exercises),
    ...Object.values(lower_body_lsd_exercises),
    ...Object.values(lower_body_heavy_exercises),
    ...Object.values(upper_body_exercises),
    ...Object.values(cardio_bursts_exercises),
    ...Object.values(lower_body_straps_exercises)
].map(exercise => ({
    ...exercise,
    // Add derived properties for compatibility with component-test
    name: exercise.exercise_name,
    category: getCategoryName(exercise.category_id),
    tags: exercise.template_tags,
    isResistance: exercise.category_id === 'c3' || exercise.category_id === 'c6'
}));

// Helper function to get category name from ID
function getCategoryName(categoryId: string): string {
    const categoryMap: Record<string, string> = {
        'c1': 'Abs',
        'c2': 'Obliques',
        'c3': 'Lower Body Heavy',
        'c4': 'Lower Body LSD',
        'c5': 'Lower Body Straps',
        'c6': 'Upper Body',
        'c7': 'Cardio Bursts'
    };
    return categoryMap[categoryId] || 'Unknown';
}
