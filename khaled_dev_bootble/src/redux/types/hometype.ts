// ------------fitness

export interface Workout {
  date: string;
  time: string;
  title: string;
}
export interface AddworkoutResponse {
  success: boolean;
  message: string;
  workout: Workout;
  totalWorkoutDuration: number;
}

export interface AddworkoutRequest {
  date: string;
  time: string;
  title: string;
}

export interface FitnessData {
  workouts: Workout[];
}

export interface FitnessRenspose {
  success: boolean;
  data: FitnessData;
}

// --------------meditation
export interface MeditationThumbnail {
  public_id: string;
  url: string;
}

export interface MeditationCategory {
  _id: string;
  name: string;
  description: string;
}

export interface MeditationItem {
  id: string;
  title: string;
  description: string;
  youtubeLink: string;
  cloudinaryUrl: string;
  duration: number;
  formattedDuration: string;
  category: MeditationCategory;
  tags: string[];
  artist: string;
  playCount: number;
  thumbnail: MeditationThumbnail;
  createdAt: string;
}

export interface MeditationResponse {
  success: boolean;
  count: number;
  total: number;
  music: MeditationItem[];
}
//=========================
//Nutrition
// ========================

export interface UpdateNutritionResponse {
  success: boolean;
  message: string;
  data: NutritionData;
  achievements: string[];
}

export interface NutritionData {
  calories: {
    target: number;
    burned: number;
  };
  workout: {
    target: number;
    duration: number;
  };
  steps: {
    target: number;
    count: number;
  };
  sleep: {
    target: number;
    duration: number;
    sleepTime: string;
    wakeTime: string;
  };
  water: {
    target: number;
    intake: number;
  };
  _id: string;
  user: string;
  date: string;
  workouts: WorkoutItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WorkoutItem {
  date: string;
  time: string;
  title: string;
  duration: number;
  caloriesBurned: number;
  _id: string;
}

export interface UpdateNutritionRequest {
  caloriesBurned: number;
  workoutDuration: number;
  stepsCount: number;
  sleepDuration: number;
  waterIntake: number;
  sleepTime: string;
  wakeTime: string;
}

//=========================
//response data week
// ========================
export interface WeekDataResponse {
  success: boolean;
  report: {
    period: string;
    startDate: string;
    endDate: string;
    total: {
      caloriesBurned: number;
      workoutMinutes: number;
      steps: number;
      sleepHours: number;
      waterLiters: number;
    };
    average: {
      caloriesBurned: number;
      workoutMinutes: number;
      steps: number;
      sleepHours: number;
      waterLiters: number;
    };
    dailyData: DailyData[];
  };
}

export interface DailyData {
  date: string;
  dayName: string;
  calories: {
    burned: number;
    target: number;
    percentage: number;
  };
  workout: {
    duration: number;
    target: number;
    percentage: number;
  };
  steps: {
    count: number;
    target: number;
    percentage: number;
  };
  sleep: {
    duration: number;
    target: number;
    percentage: number;
  };
  water: {
    intake: number;
    target: number;
    percentage: number;
  };
}
