import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './app/config/UserContext';
import MealPlannerScreen from './app/screens/6.3_MealPlannerPage';
import MyProfileScreen from './app/screens/6_MyProfilePage';
import EditProfileScreen from './app/screens/6.1_EditProfilePage';
import BookmarkScreen from './app/screens/6.2_BookmarkPage';
import GuestProfile from './app/screens/6.4_GuestProfile';
import CaloriePage from './app/screens/4_CaloriePage';
import LoginPage from './app/screens/1_LoginPage';
import Recipe from './app/screens/3_RecipePage';
import LoadingPage from './app/screens/0_LoadingPage';
import RegisterPage from './app/screens/2_RegisterPage';
import ForgotPass from './app/screens/Forgotpass';
import ResetPass from './app/screens/ResetPassword';
import RecipeCard from './app/config/RecipeCard';
import NutritionInsight from './app/screens/NutritionInsight';
import MakePlannerPage from './app/screens/3.1_MakePlannerPage';
import CommunityPage from './app/screens/7_CommunityPage';
import Scanner from './app/screens/5_ScannerPage';
import Result from './app/screens/ResultPage';
import AdminPage from './admin/AdminPage';
import RecipeManagement from './admin/RecipeManagement';
import AddRecipe from './admin/AddRecipe';
import NutritionManagement from './admin/NutritionManagement'; // Make sure this import is here!
import AddNutritionInsight from './admin/AddNutritionInsight';
import ReportManagement from './admin/ReportManagement';
import ReportDetails from './admin/ReportDetails';
import AllergyManagement from './admin/AllergyManagement';
import EditAllergy from './admin/EditAllergy';

const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
          {/* Menampilkan LoadingPage pertama kali */}
          <Stack.Screen name="Loading" component={LoadingPage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Recipe" component={Recipe} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
          <Stack.Screen name="Result" component={Result} />

          {/* Other Pages, user_id will be passed inside each component */}
          <Stack.Screen
            name="MealPlanner"
            component={MealPlannerScreen}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="MyProfile"
            component={MyProfileScreen}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="GuestProfile"
            component={GuestProfile}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />

          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="Bookmark"
            component={BookmarkScreen}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="Calorie"
            component={CaloriePage}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen name="RecipeCard" component={RecipeCard} />
          <Stack.Screen
            name="MakePlanner"
            component={MakePlannerPage}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="ForgotPass"
            component={ForgotPass}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen
            name="ResetPass"
            component={ResetPass}
            options={({ route }) => ({ initialParams: { user_id: route.params?.user_id } })}
          />
          <Stack.Screen name="Community" component={CommunityPage} />
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen name="AdminPage" component={AdminPage} />
          <Stack.Screen name="RecipeManagement" component={RecipeManagement} />
          <Stack.Screen name="AddRecipe" component={AddRecipe} />
          <Stack.Screen name="NutritionManagement" component={NutritionManagement} />
          <Stack.Screen name="AddNutritionInsight" component={AddNutritionInsight} />
          <Stack.Screen name="ReportManagement" component={ReportManagement} />
          <Stack.Screen name="ReportDetails" component={ReportDetails} />
          <Stack.Screen name="AllergyManagement" component={AllergyManagement} />
          <Stack.Screen name="EditAllergy" component={EditAllergy} />
          <Stack.Screen name="NutritionInsight" component={NutritionInsight} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
