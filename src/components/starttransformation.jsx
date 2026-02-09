import { transformProblem } from "../services/api"; // AI backend service

const handleStartTransformation = async () => {
    setTransformationStarted(true); // Start spinner / disable button

    try {
        // 1️⃣ Send user problem + previous AI data to backend
        const result = await transformProblem({
            userProblem,      // state holding user's input/problem
            previousAIData,   // state holding previous AI analysis if any
        });

        // 2️⃣ Update frontend state with AI-generated data
        setDailyTasks(result.tasks);           // AI-generated tasks
        setStrategy(result.strategy);          // AI-generated strategy text
        setCurrentStreak(result.currentStreak);
        setLongestStreak(result.longestStreak);
        setPlanStartDate(result.planStartDate);

        // 3️⃣ Optional: Show a subtle popup / toast instead of alert
        // You can replace alert with a fancier component or animation
        alert("✅ Your personalized task and strategy have been created! Check your dashboard.");

        console.log("Transformation result:", result);

    } catch (error) {
        console.error("Transformation failed:", error);
        alert("❌ Failed to create your personalized plan. Please try again!");
    } finally {
        setTransformationStarted(false); // Stop spinner / enable button
    }
};
