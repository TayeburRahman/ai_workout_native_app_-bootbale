// SelectedFoodsSection.tsx
import { useGetFoodDetailsQuery } from "@/src/redux/page/homedataApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Food {
  id: string;
  _id?: string;
  name: string;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  quantity: number;
  fiber?: number;
  sugar?: number;
  description?: string;
  customQuantity?: boolean;
}

interface SelectedFoodsSectionProps {
  foodId: string;
  selectedFoods: any[];
  setSelectedFoods: React.Dispatch<React.SetStateAction<any[]>>;
  mealTitle: string;
  setMealTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedMealType: string;
  setSelectedMealType: React.Dispatch<React.SetStateAction<string>>;
  scheduledTime: string;
  setScheduledTime: React.Dispatch<React.SetStateAction<string>>;
  mealNotes: string;
  setMealNotes: React.Dispatch<React.SetStateAction<string>>;
  showManualEntry: boolean;
  setShowManualEntry: React.Dispatch<React.SetStateAction<boolean>>;
  isAddingCustom: boolean;
  manualFood: any;
  setManualFood: React.Dispatch<React.SetStateAction<any>>;
  handleManualSubmit: () => Promise<void>;
  resetManualForm: () => void;
  timingWarning?: string;
}

const MEAL_TYPES = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
  { label: "Pre Workout", value: "pre_workout" },
  { label: "Post Workout", value: "post_workout" },
];

export const SelectedFoodsSection: React.FC<SelectedFoodsSectionProps> = ({
  foodId,
  selectedFoods,
  setSelectedFoods,
  mealTitle,
  setMealTitle,
  selectedMealType,
  setSelectedMealType,
  scheduledTime,
  setScheduledTime,
  mealNotes,
  setMealNotes,
  showManualEntry,
  setShowManualEntry,
  isAddingCustom,
  manualFood,
  setManualFood,
  handleManualSubmit,
  resetManualForm,
  timingWarning,
}) => {
  // Fetch food details when foodId changes and is valid
  const {
    data: foodDetails,
    isLoading,
    isSuccess,
  } = useGetFoodDetailsQuery(foodId, {
    skip: !foodId || foodId.length === 0, // Skip if no foodId
  });

  // Update selected food with real data when details are fetched
  useEffect(() => {
    if (isSuccess && foodDetails?.data && foodId) {
      console.log("Food details received:", foodDetails.data);

      setSelectedFoods((prevFoods) => {
        // Find the food that was just added (the one with matching id)
        const updatedFoods = prevFoods.map((food) => {
          if (food.id === foodId || food._id === foodId) {
            // Update with real data from API
            return {
              ...food,
              calories: foodDetails.data.calories || food.calories,
              protein: foodDetails.data.protein || food.protein,
              fat: foodDetails.data.fat || food.fat,
              carbs: foodDetails.data.carbs || food.carbs,
              fiber: foodDetails.data.fiber || 0,
              sugar: foodDetails.data.sugar || 0,
              servingSize: foodDetails.data.servingSize || food.servingSize,
              servingUnit: foodDetails.data.servingUnit || food.servingUnit,
              brand: foodDetails.data.brand || food.brand,
              description: foodDetails.data.description || food.description,
            };
          }
          return food;
        });
        return updatedFoods;
      });
    }
  }, [isSuccess, foodDetails, foodId, setSelectedFoods]);

  // Calculate total nutrition
  const totalNutrition = selectedFoods.reduce(
    (totals, food) => {
      const multiplier = food.quantity / food.servingSize;
      return {
        calories: totals.calories + (food.calories || 0) * multiplier,
        protein: totals.protein + (food.protein || 0) * multiplier,
        fat: totals.fat + (food.fat || 0) * multiplier,
        carbs: totals.carbs + (food.carbs || 0) * multiplier,
      };
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 },
  );

  // Handlers
  const removeFood = (index: number) => {
    setSelectedFoods((prev: Food[]) => prev.filter((_, i) => i !== index));
  };

  const updateFoodQuantity = (index: number, newQuantity: number) => {
    setSelectedFoods((prev: Food[]) =>
      prev.map((food, i) =>
        i === index ? { ...food, quantity: newQuantity } : food,
      ),
    );
  };

  /** Render selected foods with quantity controls */
  const renderSelectedFoods = () => {
    if (selectedFoods.length === 0) return null;

    return (
      <View className="bg-white/5 rounded-xl p-3 mb-4">
        <Text className="text-white font-JosefinSansSemiBold mb-2">
          Selected Foods ({selectedFoods.length})
          {isLoading && <ActivityIndicator size="small" color="#8B5CF6" />}
        </Text>

        {selectedFoods.map((food, index) => (
          <View
            key={`${food.id || food._id}-${index}`}
            className="mb-3 border-b border-white/10 pb-2"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-JosefinSansMedium flex-1">
                {food.name}
              </Text>
              <TouchableOpacity
                onPress={() => removeFood(index)}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>

            {/* Show loading indicator for food being fetched */}
            {foodId === food.id && isLoading && (
              <View className="flex-row items-center mt-1">
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text className="text-violet-300 text-xs ml-2">
                  Loading nutrition data...
                </Text>
              </View>
            )}

            {/* Quantity Control */}
            <View className="flex-row items-center mt-2">
              <Text className="text-white/70 text-sm mr-3">Quantity (g):</Text>
              <View className="flex-row items-center bg-white/10 rounded-lg">
                <TouchableOpacity
                  onPress={() =>
                    updateFoodQuantity(index, Math.max(1, food.quantity - 10))
                  }
                  className="px-3 py-1"
                >
                  <Ionicons name="remove" size={16} color="#fff" />
                </TouchableOpacity>
                <TextInput
                  value={food.quantity.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    updateFoodQuantity(index, Math.max(1, value));
                  }}
                  keyboardType="numeric"
                  className="text-white text-center font-JosefinSansMedium w-16 py-1"
                />
                <TouchableOpacity
                  onPress={() => updateFoodQuantity(index, food.quantity + 10)}
                  className="px-3 py-1"
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nutrition for this food */}
            <View className="flex-row gap-3 mt-1">
              <Text className="text-xs text-gray-300">
                {(
                  ((food.calories || 0) * food.quantity) /
                  food.servingSize
                ).toFixed(0)}{" "}
                cal
              </Text>
              <Text className="text-xs text-blue-300">
                P:{" "}
                {(
                  ((food.protein || 0) * food.quantity) /
                  food.servingSize
                ).toFixed(1)}
                g
              </Text>
              <Text className="text-xs text-yellow-300">
                F:{" "}
                {(((food.fat || 0) * food.quantity) / food.servingSize).toFixed(
                  1,
                )}
                g
              </Text>
              <Text className="text-xs text-green-300">
                C:{" "}
                {(
                  ((food.carbs || 0) * food.quantity) /
                  food.servingSize
                ).toFixed(1)}
                g
              </Text>
            </View>
          </View>
        ))}

        {/* Total Nutrition Summary */}
        <View className="mt-4 p-4 rounded-xl bg-violet-900/40 border border-violet-500/30">
          <Text className="text-white font-JosefinSansBold text-base mb-3">
            Meal Summary Before Save
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-white font-JosefinSansBold text-lg">
                {totalNutrition.calories.toFixed(0)}
              </Text>
              <Text className="text-gray-300 text-xs font-JosefinSansMedium mt-1">
                Kcal Total
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-blue-400 font-JosefinSansBold text-lg">
                {totalNutrition.protein.toFixed(1)}g
              </Text>
              <Text className="text-gray-300 font-JosefinSansMedium text-xs mt-1">
                Protein
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-yellow-400 font-JosefinSansBold text-lg">
                {totalNutrition.fat.toFixed(1)}g
              </Text>
              <Text className="text-gray-300 text-xs font-JosefinSansMedium mt-1">
                Fat
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-green-400 font-JosefinSansBold text-lg">
                {totalNutrition.carbs.toFixed(1)}g
              </Text>
              <Text className="text-gray-300 text-xs font-JosefinSansMedium mt-1">
                Carbs
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /** Render meal details form */
  const renderMealDetails = () => (
    <View className="mb-4">
      <Text className="text-white font-JosefinSansSemiBold mb-2">
        Meal Details
      </Text>

      {timingWarning ? (
        <View className="bg-amber-500/20 rounded-xl px-4 py-3 mb-3 border border-amber-500/50 flex-row items-center">
          <Ionicons name="warning" size={20} color="#F59E0B" />
          <Text className="text-amber-400 font-JosefinSansMedium ml-2 flex-1">
            {timingWarning}
          </Text>
        </View>
      ) : null}

      {/* Meal Title */}
      <TextInput
        value={mealTitle}
        onChangeText={setMealTitle}
        placeholder="Meal title (e.g., Post-workout snack)"
        placeholderTextColor="#9CA3AF"
        className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansMedium mb-2"
      />

      {/* Meal Type Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2"
      >
        <View className="flex-row gap-2">
          {MEAL_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              onPress={() => setSelectedMealType(type.value)}
              className={`px-4 py-2 rounded-full ${
                selectedMealType === type.value
                  ? "bg-violet-500"
                  : "bg-white/10"
              }`}
            >
              <Text className="text-white text-sm font-JosefinSansSemiBold">
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Time Input */}
      <TextInput
        value={scheduledTime}
        onChangeText={setScheduledTime}
        placeholder="Time (HH:MM)"
        placeholderTextColor="#9CA3AF"
        className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansMedium mb-2"
      />

      {/* Notes */}
      <TextInput
        value={mealNotes}
        onChangeText={setMealNotes}
        placeholder="Notes (optional)"
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={2}
        className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansMedium"
      />
    </View>
  );

  const renderManualEntry = () => {
    const expectedCalories = Math.round(
      (parseFloat(manualFood.protein) || 0) * 4 +
      (parseFloat(manualFood.carbs) || 0) * 4 +
      (parseFloat(manualFood.fat) || 0) * 9
    );

    return (
      <View className="space-y-4">
        {/* Header with back button */}
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => setShowManualEntry(false)}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-JosefinSansSemiBold">
            Manual Food Entry
          </Text>
        </View>

        {/* Food Name */}
        <View>
          <Text className="text-white font-JosefinSansSemiBold mb-2">
            Food Name *
          </Text>
          <TextInput
            value={manualFood.name}
            onChangeText={(text) => setManualFood({ ...manualFood, name: text })}
            placeholder="Enter food name"
            placeholderTextColor="#9CA3AF"
            className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansSemiBold"
          />
        </View>

        {/* Brand (Optional) */}
        <View>
          <Text className="text-white font-JosefinSansSemiBold mb-2">
            Brand (Optional)
          </Text>
          <TextInput
            value={manualFood.brand}
            onChangeText={(text) => setManualFood({ ...manualFood, brand: text })}
            placeholder="Enter brand name"
            placeholderTextColor="#9CA3AF"
            className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansSemiBold"
          />
        </View>

        {/* Serving Size */}
        <View>
          <Text className="text-white font-JosefinSansSemiBold mb-2">
            Serving Size (g) *
          </Text>
          <TextInput
            value={manualFood.servingSize}
            onChangeText={(text) =>
              setManualFood({ ...manualFood, servingSize: text })
            }
            placeholder="100"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansSemiBold"
          />
        </View>

        {/* Auto-Calculate Toggle */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setManualFood({ ...manualFood, autoCalculate: !manualFood.autoCalculate })}
          className="flex-row items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10 mb-1"
        >
          <View className={`w-5 h-5 rounded border items-center justify-center mr-3 ${manualFood.autoCalculate ? "bg-violet-500 border-violet-500" : "border-gray-400"}`}>
            {manualFood.autoCalculate && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text className="text-white font-JosefinSansMedium text-sm flex-1">
            Auto-calculate calories from macros
          </Text>
        </TouchableOpacity>

        {/* Nutrition Inputs */}
        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 min-w-[45%]">
            <Text className="text-white mb-2 font-JosefinSansSemiBold">
              Calories *
            </Text>
            <TextInput
              value={manualFood.calories}
              onChangeText={(text) =>
                setManualFood({ ...manualFood, calories: text })
              }
              editable={!manualFood.autoCalculate}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className={`${manualFood.autoCalculate ? "bg-white/5 text-white/50" : "bg-white/10 text-white"} rounded-xl px-4 py-3 text-center font-JosefinSansMedium`}
            />
            {manualFood.autoCalculate ? (
              <Text className="text-[10px] text-white/40 mt-1 font-JosefinSansRegular text-center">
                Locked to macro sum
              </Text>
            ) : (
              Math.abs((parseFloat(manualFood.calories) || 0) - expectedCalories) > 5 && (
                <Text className="text-[10px] text-amber-400 mt-1 font-JosefinSansMedium text-center">
                  ⚠️ Expected: ~{expectedCalories} kcal
                </Text>
              )
            )}
          </View>

          <View className="flex-1 min-w-[45%]">
            <Text className="text-white mb-2 font-JosefinSansSemiBold">
              Protein (g) *
            </Text>
            <TextInput
              value={manualFood.protein}
              onChangeText={(text) =>
                setManualFood({ ...manualFood, protein: text })
              }
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="bg-white/10 rounded-xl px-4 py-3 text-white text-center font-JosefinSansMedium"
            />
          </View>

          <View className="flex-1 min-w-[45%]">
            <Text className="text-white mb-2 font-JosefinSansSemiBold">
              Fat (g) *
            </Text>
            <TextInput
              value={manualFood.fat}
              onChangeText={(text) => setManualFood({ ...manualFood, fat: text })}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="bg-white/10 rounded-xl px-4 py-3 text-white text-center font-JosefinSansMedium"
            />
          </View>

          <View className="flex-1 min-w-[45%]">
            <Text className="text-white mb-2 font-JosefinSansSemiBold">
              Carbs (g) *
            </Text>
            <TextInput
              value={manualFood.carbs}
              onChangeText={(text) =>
                setManualFood({ ...manualFood, carbs: text })
              }
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="bg-white/10 rounded-xl px-4 py-3 text-white text-center font-JosefinSansMedium"
            />
          </View>
        </View>

        {/* Description (Optional) */}
        <View>
          <Text className="text-white font-JosefinSansSemiBold mb-2">
            Description (Optional)
          </Text>
          <TextInput
            value={manualFood.description}
            onChangeText={(text) =>
              setManualFood({ ...manualFood, description: text })
            }
            placeholder="Enter description"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            className="bg-white/10 rounded-xl px-4 py-3 text-white font-JosefinSansSemiBold"
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 pt-4">
          <TouchableOpacity
            onPress={resetManualForm}
            className="flex-1 bg-white/10 rounded-xl py-3 items-center"
          >
            <Text className="text-white font-JosefinSansSemiBold">Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleManualSubmit}
            disabled={isAddingCustom}
            className="flex-1 bg-violet-500 rounded-xl py-3 items-center"
          >
            {isAddingCustom ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-JosefinSansSemiBold">
                Add Food
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      {showManualEntry ? (
        renderManualEntry()
      ) : (
        <>
          {renderSelectedFoods()}
          {renderMealDetails()}
        </>
      )}
    </View>
  );
};
