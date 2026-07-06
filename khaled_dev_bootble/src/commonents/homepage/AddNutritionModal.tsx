// AddNutritionModal.tsx
import {
  useGetSearchFoodQuery,
  usePostAddMealsMutation,
  usePostCustomAddMealsMutation,
  useGetAiNutritionAdviceQuery,
} from "@/src/redux/page/homedataApi";
import { useGetProfileDataQuery } from "@/src/redux/page/profiledataApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectedFoodsSection } from "./SelectedFoodsSection"; // Adjust the import path as needed

// Types
interface SearchFoodItem {
  id: string;
  fdcId?: number;
  name: string;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  source: string;
}

interface FoodDetails {
  _id: string;
  fdcId: string;
  name: string;
  brand: string | null;
  description: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  source: string;
  id: string;
}

interface SelectedFood extends FoodDetails {
  quantity: number;
  customQuantity: boolean;
}

interface ManualFoodEntry {
  name: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  servingSize: string;
  brand?: string;
  description?: string;
  autoCalculate?: boolean;
}

interface AddNutritionModalProps {
  open: boolean;
  close: () => void;
  selectedDate?: Date;
  onMealAdded?: () => void;
}

// Removed hardcoded getSuggestedMealContext - using backend AI directly

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AddNutritionModal: React.FC<AddNutritionModalProps> = ({
  open,
  close,
  selectedDate = new Date(),
  onMealAdded,
}) => {
  // API Hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: searchResults, isLoading: searchLoading } =
    useGetSearchFoodQuery(debouncedSearchTerm, {
      skip: !debouncedSearchTerm || debouncedSearchTerm.length < 2,
    });

  const [postAddMeals, { isLoading: isAddingMeal }] = usePostAddMealsMutation();
  const [postCustomAddMeals, { isLoading: isAddingCustom }] =
    usePostCustomAddMealsMutation();
  
  const { data: profileData } = useGetProfileDataQuery();
  const { data: aiNutritionData } = useGetAiNutritionAdviceQuery();

  // Local State
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualFood, setManualFood] = useState<ManualFoodEntry>({
    name: "",
    calories: "0",
    protein: "0",
    fat: "0",
    carbs: "0",
    servingSize: "100",
    brand: "",
    description: "",
    autoCalculate: true,
  });
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const [timingWarning, setTimingWarning] = useState("");
  const [foodIdRecent, setFoodIdRecent] = useState("");
  const [mealTitle, setMealTitle] = useState("");
  const [mealNotes, setMealNotes] = useState("");
  const [scheduledTime, setScheduledTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  // Analyze Context using Backend AI
  useEffect(() => {
    if (open) {
      let suggestedType = "snack";
      let warningMessage = "";

      if (aiNutritionData?.data) {
        const { meal_timing_windows, shift_specific } = aiNutritionData.data;
        const [hours, mins] = scheduledTime.split(":").map(Number);
        const currentMins = hours * 60 + mins;

        if (meal_timing_windows) {
          // Parse HH:MM-HH:MM and check if currentMins falls inside
          const isInside = (timeRange: string) => {
            const [start, end] = timeRange.split("-");
            const [sh, sm] = start.split(":").map(Number);
            const [eh, em] = end.split(":").map(Number);
            let startMins = sh * 60 + sm;
            let endMins = eh * 60 + em;

            if (endMins < startMins) {
              // cross midnight
              return currentMins >= startMins || currentMins <= endMins;
            }
            return currentMins >= startMins && currentMins <= endMins;
          };

          if (meal_timing_windows.breakfast && isInside(meal_timing_windows.breakfast)) {
            suggestedType = "breakfast";
          } else if (meal_timing_windows.lunch && isInside(meal_timing_windows.lunch)) {
            suggestedType = "lunch";
          } else if (meal_timing_windows.dinner && isInside(meal_timing_windows.dinner)) {
            suggestedType = "dinner";
          } else if (meal_timing_windows.snacks && meal_timing_windows.snacks.some((s: string) => isInside(s))) {
            suggestedType = "snack";
          }
        }

        // Show a random AI Coach Tip specific to their shift
        if (shift_specific && shift_specific.length > 0) {
          warningMessage = "🤖 AI Coach: " + shift_specific[Math.floor(Math.random() * shift_specific.length)];
        }
      }

      setSelectedMealType(suggestedType);
      setTimingWarning(warningMessage);
      
      if (!mealTitle) {
        setMealTitle(`${suggestedType.charAt(0).toUpperCase() + suggestedType.slice(1)}`);
      }
    }
  }, [open, profileData, aiNutritionData, scheduledTime]);

  // Debounce search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        setDebouncedSearchTerm(searchTerm);
      } else {
        setDebouncedSearchTerm("");
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Auto calculate calories from macros
  useEffect(() => {
    if (manualFood.autoCalculate) {
      const p = parseFloat(manualFood.protein) || 0;
      const f = parseFloat(manualFood.fat) || 0;
      const c = parseFloat(manualFood.carbs) || 0;
      const calculated = Math.round(p * 4 + c * 4 + f * 9);
      if (manualFood.calories !== calculated.toString()) {
        setManualFood((prev) => ({
          ...prev,
          calories: calculated.toString(),
        }));
      }
    }
  }, [manualFood.protein, manualFood.fat, manualFood.carbs, manualFood.autoCalculate]);

  /** Calculate total nutrition based on quantities */
  const totalNutrition = useMemo(() => {
    return selectedFoods.reduce(
      (acc, food) => {
        const multiplier = food.quantity / food.servingSize;
        return {
          calories: acc.calories + food.calories * multiplier,
          protein: acc.protein + food.protein * multiplier,
          fat: acc.fat + food.fat * multiplier,
          carbs: acc.carbs + food.carbs * multiplier,
        };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 },
    );
  }, [selectedFoods]);

  /** Add food from search results */
  const addFoodToSelection = (food: SearchFoodItem) => {
    setFoodIdRecent(food.id);
    const newFood: SelectedFood = {
      _id: food.id,
      fdcId: food.fdcId?.toString() || "",
      name: food.name,
      brand: food.brand,
      description: food.name,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      source: food.source,
      id: food.id,
      quantity: food.servingSize,
      customQuantity: false,
    };

    // Demo values
    if (food.name.toLowerCase().includes("apple")) {
      newFood.calories = 95;
      newFood.protein = 0.5;
      newFood.fat = 0.3;
      newFood.carbs = 25;
    } else if (food.name.toLowerCase().includes("chicken")) {
      newFood.calories = 165;
      newFood.protein = 31;
      newFood.fat = 3.6;
      newFood.carbs = 0;
    }

    setSelectedFoods((prev) => [...prev, newFood]);
  };

  /** Reset manual entry form */
  const resetManualForm = () => {
    setManualFood({
      name: "",
      calories: "0",
      protein: "0",
      fat: "0",
      carbs: "0",
      servingSize: "100",
      brand: "",
      description: "",
      autoCalculate: true,
    });
  };

  /** Handle manual food submission */
  const handleManualSubmit = async () => {
    if (!manualFood.name.trim()) {
      Alert.alert("Error", "Please enter food name");
      return;
    }

    const servingSize = parseFloat(manualFood.servingSize);
    if (isNaN(servingSize) || servingSize <= 0) {
      Alert.alert("Error", "Serving size must be greater than 0");
      return;
    }

    const calories = parseFloat(manualFood.calories);
    if (isNaN(calories) || calories <= 0) {
      Alert.alert("Error", "Calories must be greater than 0");
      return;
    }

    const protein = parseFloat(manualFood.protein) || 0;
    const fat = parseFloat(manualFood.fat) || 0;
    const carbs = parseFloat(manualFood.carbs) || 0;

    if (protein < 0 || fat < 0 || carbs < 0) {
      Alert.alert("Error", "Macros cannot be negative values");
      return;
    }

    if (protein === 0 && fat === 0 && carbs === 0) {
      Alert.alert(
        "Invalid Data", 
        "A food must contain at least some macronutrients (Protein, Fat, or Carbs). Empty foods are not permitted."
      );
      return;
    }

    if (!manualFood.autoCalculate) {
      const expectedCalories = Math.round((protein * 4) + (carbs * 4) + (fat * 9));
      const variance = Math.abs(calories - expectedCalories);
      
      // Allow a 20% tolerance, or a minimum flat tolerance of 15 calories for very small numbers
      const allowedVariance = Math.max(expectedCalories * 0.20, 15);
      
      if (variance > allowedVariance) {
        Alert.alert(
          "Inconsistent Nutrition Data",
          `The manually entered calories (${calories} kcal) do not match the expected calories based on the macros you provided (~${expectedCalories} kcal).\n\nPlease correct the values or enable Auto-calculate.`
        );
        return;
      }
    }

    try {
      const customFoodResponse = await postCustomAddMeals({
        name: manualFood.name.trim(),
        servingSize,
        calories,
        protein,
        fat,
        carbs,
        brand: manualFood.brand || "Custom",
        description: manualFood.description || manualFood.name.trim(),
      }).unwrap();

      const newFood: SelectedFood = {
        _id: customFoodResponse.data._id,
        fdcId: "",
        name: customFoodResponse.data.name,
        brand: customFoodResponse.data.brand,
        description: customFoodResponse.data.description,
        servingSize: customFoodResponse.data.servingSize,
        servingUnit: customFoodResponse.data.servingUnit,
        calories: customFoodResponse.data.calories,
        protein: customFoodResponse.data.protein,
        carbs: customFoodResponse.data.carbs,
        fat: customFoodResponse.data.fat,
        fiber: customFoodResponse.data.fiber || 0,
        sugar: customFoodResponse.data.sugar || 0,
        source: "custom",
        id: customFoodResponse.data._id,
        quantity: servingSize,
        customQuantity: false,
      };

      setSelectedFoods((prev) => [...prev, newFood]);
      resetManualForm();
      setShowManualEntry(false);
      Alert.alert("Success", "Food added successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create custom food");
      console.error(error);
    }
  };

  /** Log meal to backend */
  const handleLogMeal = async () => {
    if (!selectedFoods.length) {
      Alert.alert("No food selected", "Please add at least one food");
      return;
    }

    if (!mealTitle.trim()) {
      Alert.alert("Error", "Please enter a meal title");
      return;
    }

    try {
      const mealData = {
        mealType: selectedMealType,
        title: mealTitle,
        scheduledTime: scheduledTime,
        notes: mealNotes,
        date: selectedDate.toISOString(),
        items: selectedFoods.map((food) => ({
          foodId: food.id || food._id,
          name: food.name,
          quantity: food.quantity,
          servingSize: food.servingSize,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          source: food.source,
        })),
      };

      const res = await postAddMeals(mealData).unwrap();

      Alert.alert(
        "Success!",
        `Meal logged successfully!\n\nTotal Nutrition:\nCalories: ${totalNutrition.calories.toFixed(0)}\nProtein: ${totalNutrition.protein.toFixed(1)}g\nFat: ${totalNutrition.fat.toFixed(1)}g\nCarbs: ${totalNutrition.carbs.toFixed(1)}g`,
      );

      setSelectedFoods([]);
      setSearchTerm("");
      setMealTitle("");
      setMealNotes("");
      setSelectedMealType("breakfast");
      if (onMealAdded) onMealAdded();
      close();
    } catch (error) {
      Alert.alert("Error", "Failed to log meal");
      console.error(error);
    }
  };

  /** Render search results */
  const renderSearchResults = () => {
    if (!debouncedSearchTerm) return null;

    if (searchLoading) {
      return (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-white/50 mt-2 font-JosefinSansRegular">
            Searching...
          </Text>
        </View>
      );
    }

    const foods = searchResults?.data || [];

    if (foods.length === 0 && debouncedSearchTerm.length >= 2) {
      return (
        <Text className="text-center text-white/50 font-JosefinSansRegular py-6">
          No foods found. Try a different search or add manually.
        </Text>
      );
    }

    const isFoodSelected = (foodId: string) => {
      return selectedFoods.some(
        (food) => food.id === foodId || food._id === foodId,
      );
    };

    return foods.map((item: SearchFoodItem) => {
      const isAdded = isFoodSelected(item.id);

      return (
        <TouchableOpacity
          key={item.id}
          onPress={() => addFoodToSelection(item)}
          className="flex-row items-center justify-between py-3 border-b border-white/10"
        >
          <View className="flex-1">
            <View className="flex-row items-center gap-3 mb-1">
              <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                <Ionicons name="nutrition" size={16} color="#fff" />
              </View>
              <Text className="text-white font-JosefinSansMedium flex-1">
                {item.name}
              </Text>
            </View>
            <Text className="text-xs text-gray-300 ml-11">
              {item.servingSize}
              {item.servingUnit} • {item.source}
            </Text>
          </View>
          {isAdded ? (
            <View className="px-4 py-1.5 rounded-full bg-green-500/30 ml-2 border border-green-500">
              <Text className="text-green-400 text-sm font-JosefinSansSemiBold">
                Added ✓
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                addFoodToSelection(item);
                setFoodIdRecent(item.id);
              }}
              className="px-4 py-1.5 rounded-full bg-violet-500 ml-2"
            >
              <Text className="text-white text-sm font-JosefinSansSemiBold">
                + Add
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    });
  };

  const renderSmartSuggestions = () => {
    if (debouncedSearchTerm) return null;

    const recommendedFoods = aiNutritionData?.data?.recommended_foods;
    if (!recommendedFoods) return null;

    let foods = recommendedFoods[selectedMealType] || recommendedFoods.snack || [];

    if (foods.length === 0) return null;

    return (
      <View className="mb-4">
        <Text className="text-white/70 font-JosefinSansSemiBold mb-3">
          Smart Suggestions for {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {foods.map((food: string, index: number) => (
            <TouchableOpacity
              key={`suggestion-${index}`}
              onPress={() => setSearchTerm(food)}
              className="bg-white/10 px-4 py-2 rounded-full border border-violet-500/30"
            >
              <Text className="text-white text-sm font-JosefinSansMedium">{food}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  /** Render main content */
  const renderMainContent = () => (
    <>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View />
        <Text className="text-white text-xl font-JosefinSansSemiBold">
          Add Nutrition
        </Text>
        <TouchableOpacity
          onPress={close}
          className="w-8 h-8 rounded-full bg-white/10 items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-white/10 rounded-xl px-3 mb-4">
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search food (min. 2 characters)..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 px-2 py-3 text-white font-JosefinSansMedium"
        />
        {searchLoading && <ActivityIndicator size="small" color="#8B5CF6" />}
      </View>

      {/* Smart Suggestions */}
      {renderSmartSuggestions()}

      {/* Search Results */}
      <View className="mb-3">{renderSearchResults()}</View>

      {/* Selected Foods Section */}
      <SelectedFoodsSection
        foodId={foodIdRecent}
        selectedFoods={selectedFoods}
        setSelectedFoods={setSelectedFoods}
        mealTitle={mealTitle}
        setMealTitle={setMealTitle}
        selectedMealType={selectedMealType}
        setSelectedMealType={setSelectedMealType}
        scheduledTime={scheduledTime}
        setScheduledTime={setScheduledTime}
        mealNotes={mealNotes}
        setMealNotes={setMealNotes}
        showManualEntry={showManualEntry}
        setShowManualEntry={setShowManualEntry}
        isAddingCustom={isAddingCustom}
        manualFood={manualFood}
        setManualFood={setManualFood}
        handleManualSubmit={handleManualSubmit}
        resetManualForm={resetManualForm}
        timingWarning={timingWarning}
      />

      {/* Manual Entry Button (only show when not in manual entry mode) */}
      {!showManualEntry && (
        <TouchableOpacity
          onPress={() => setShowManualEntry(true)}
          className="py-3 flex-row items-center justify-center mb-3"
        >
          <Ionicons name="add-circle-outline" size={18} color="#A78BFA" />
          <Text className="text-violet-300 text-sm font-JosefinSansMedium ml-2">
            Manual Food Entry
          </Text>
        </TouchableOpacity>
      )}

      {/* Log Meal Button */}
      {selectedFoods.length > 0 && !showManualEntry && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleLogMeal}
          disabled={isAddingMeal || !mealTitle.trim()}
        >
          <LinearGradient
            colors={
              !mealTitle.trim()
                ? ["#4B5563", "#374151"]
                : ["#8B5CF6", "#6D28D9"]
            }
            className="py-4 rounded-full items-center"
            style={{
              borderRadius: 15,
              alignItems: "center",

              paddingVertical: 12,
            }}
          >
            {isAddingMeal ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-JosefinSansBold text-base">
                Log Meal ({selectedFoods.length} item
                {selectedFoods.length > 1 ? "s" : ""})
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        onPress={close}
        className="flex-1 bg-black/50 justify-center items-center"
      >
        <Pressable
          className="w-[90%] rounded-3xl overflow-hidden "
          style={{ maxHeight: SCREEN_HEIGHT * 0.85 }}
        >
          <LinearGradient
            colors={["#1B1440", "#2A1F5F"]}
            style={{ paddingHorizontal: "4%", paddingVertical: "6%" }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "android" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              >
                {renderMainContent()}
                {/* Add bottom padding for better scrolling experience */}
                <View className="h-4" />
              </ScrollView>
            </KeyboardAvoidingView>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddNutritionModal;
