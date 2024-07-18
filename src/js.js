import OpenAI from "openai";
import {config} from 'dotenv';


 //console.log(import.meta.env.VITE_OPENAI_API_KEY);
const openai = new OpenAI({
    apiKey:(import.meta.env.VITE_OPENAI_API_KEY),
    dangerouslyAllowBrowser: true

  });

export default async function callOpenAI(thread) {
try{
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are going to help people write 3 personalized greetings- json",
                },
                { 
                    role: "user", 
                    content: `${thread}`
                }
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });
        console.log(thread);
        
        console.log(completion.choices[0].message.content);
        return completion.choices[0].message.content;

      }catch(error){
        console.error("error calling openAI", error);
        throw error;
      }
}