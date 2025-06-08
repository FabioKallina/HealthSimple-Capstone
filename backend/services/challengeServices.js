
import ChallengeProgress from "../models/communityModels/challengeProgressModel.js";

const checkCompletion = (habitData, challenge) => {
    return challenge.requiredHabits.every((req) => {
        const count = habitData.filter(
            (h) => h.habitName === req.name && h.status === 4
        ).length;
        console.log(`Checking habit "${req.name}": ${count}/${req.count}`);
        return count >= req.count;
    });
}

export const updatedChallengeProgress = async (userId, userHabitData) => {
    const userChallenge = await ChallengeProgress.find({ userId, completed: false });

    for ( const challenge of userChallenge ) {
        const startDate = new Date(challenge.date);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + challenge.duration);

        const filteredHabits = userHabitData.filter((log) => {
            const logDate = new Date(log.date);
            return logDate >= startDate && logDate <= endDate;
        });

        if (checkCompletion(filteredHabits, challenge)) {
            challenge.completed = true;
            challenge.badgeEarned = true;
            await challenge.save();
        }
    }
}