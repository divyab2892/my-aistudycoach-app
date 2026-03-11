
import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function profileToString(profile: StudentProfile): string {
    const subjectsSummary = profile.subjects
        .map(s => `- ${s.name} (Current Confidence: ${s.confidence})`)
        .join('\n');

    return `
Here is the student's profile:
- Learning Goal: ${profile.goal}
- Deadline/Exam Date: ${profile.deadline}
- Daily Time Available: ${profile.dailyHours} hours
- Subjects to Study:
${subjectsSummary}
`;
}

export async function generateStudyPlan(profile: StudentProfile): Promise<string> {
    const model = 'gemini-3-flash-preview';
    const profileSummary = profileToString(profile);
    const prompt = `
Based on the student profile below, create a personalized 7-day study plan.

Rules:
- Study time per day should not exceed the available ${profile.dailyHours} hours.
- Allocate more time and focus on subjects with 'Low' confidence.
- Allocate a moderate amount of time to subjects with 'Medium' confidence.
- Use subjects with 'High' confidence for quick revisions.
- Include specific topics to cover for each subject.
- Include short 10-15 minute breaks in the schedule.
- Include time for revision and practice questions at the end of each day.
- Keep the plan realistic, encouraging, and motivating.
- Structure the output in a clear, day-by-day format using Markdown. Use headings for each day (e.g., "### Day 1: Focus on Fundamentals").

${profileSummary}
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error generating study plan:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}

export async function getSmartTutorExplanation(topic: string, context: string): Promise<string> {
    const model = 'gemini-3-flash-preview';
    const prompt = `
Explain the following topic in a simple and easy-to-understand way.

Guidelines:
- First, try to answer the question using the provided "Context" below. Your primary goal is to explain concepts based on this context.
- If the context doesn't contain the answer, then use your general knowledge.
- Assume the student is a complete beginner.
- Use simple language and analogies or real-world examples.
- Break down the explanation into small, numbered steps or bullet points.
- Keep paragraphs short.
- End with a quick, concise summary of the key points.

Context:
---
${context || 'No context provided.'}
---

Topic:
${topic}
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error)
    {
        console.error("Error getting explanation:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}

export async function getDailyMotivation(): Promise<string> {
    const model = 'gemini-3-flash-preview';
    const prompt = `
A student has just completed their study session for the day. Generate a motivational message for them.

The response should have three parts:
1.  A short, encouraging motivational message celebrating their effort.
2.  One specific positive reinforcement about their dedication or consistency.
3.  One small, constructive suggestion for improvement for their next study session (e.g., 'try a new note-taking method' or 'review today's notes tomorrow morning').

Keep the tone friendly, encouraging, and not strict. Format the output clearly, perhaps with bullet points.
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error generating motivation:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}

export async function analyzeProgress(progressData: string): Promise<string> {
    const model = 'gemini-3-flash-preview';
    const prompt = `
Analyze the student's weekly progress data provided below.

Provide:
1.  **Strengths:** Identify topics where the student is performing well based on high quiz scores.
2.  **Weak Areas:** Pinpoint subjects or topics needing more attention, indicated by lower scores.
3.  **Study Consistency:** Comment on their study habits based on the number of days studied vs. missed.
4.  **Actionable Tips:** Give 2-3 specific, actionable improvement tips for the next week based on the analysis.

Keep the feedback constructive, positive, and motivating.

Progress Data:
${progressData}
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing progress:", error);
        throw new Error("Failed to communicate with the AI model.");
    }
}
