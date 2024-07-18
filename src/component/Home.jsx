import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button } from '@mui/base';
import callOpenAI from '../js.js';
import '../css/Home.css'

const types = [
    { id: 10, name: 'יומהולדת' },
    { id: 20, name: 'חתונה' },
    { id: 30, name: 'בר מצווה' },
    { id: 40, name: 'יום נישואין' },
    { id: 50, name: 'בת מצווה' },
    { id: 60, name: 'מורה' },
    { id: 70, name: 'לידה' },
];
const typesTeacher = [
    { id: 10, name: 'פורים' },
    { id: 20, name: 'פסח' },
    { id: 30, name: 'סוף שנה ' },
    { id: 40, name: 'ראש השנה' },
];



function Home() {
    const [type, setType] = useState('');
    const [showAgeField, setShowAgeField] = useState(false);
    const [showTypesTeacher, setshowTypesTeacher] = useState(false);
    const [result, setResult] = useState([]);//הערכים שיוחזרו יוכנסו למערך
    const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
    const [teacher, setTeacher] = useState('');
    const [greetingLength, setGreetingLength] = useState(50); // ערך ברירת מחדל לאורך הברכה
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        resetState();//איפוס המצב לפני החיפוש החדש
        const selectedValue = event.target.value;
        setType(selectedValue);

        setShowAgeField(event.target.value === 10);
        setshowTypesTeacher(event.target.value === 60);
        setTeacher('');//אתחול מורה
    };

    //עדכון של סוג מורה
    const handleTeacherChange = (event) => {
        const selectedTeacher = event.target.value;
        setTeacher(selectedTeacher);
    };

    //עדכון אורך הברכה
    const handleGreetingLengthChange = (event, newValue) => {
        setGreetingLength(newValue);
    };

    const resetState = () => {//איפוס כמות התצוגה
        setResult([]);
        setCurrentGreetingIndex(0);
    };
    
    

    const handeleSearchBlessing = async () => {
       // resetState();//איפוס המצב לפני החיפוש החדש

        if (!type) {
            alert('בבקשה בחר סוג ברכה');
            return;
        }

        setIsLoading(true);
        const selectType = types.find((t) => t.id === parseInt(type, 10)).name;
        const blessingType = document.getElementById('blessing-type-input').value;
        const atmosphere = document.getElementById('atmosphere-input').value;
        const age = showAgeField ? document.getElementById('age-input').value : '';
        let teacherType = '';
        if (showTypesTeacher && teacher) {//בודק אם בחרו מורה
            teacherType = typesTeacher.find((t) => t.id === parseInt(teacher, 10)).name;
        }
        let thread = `כתוב לי 3 ברכות שונות שכתובות בצורה יפה מאוד וברמה גבוהה עבור ${selectType} שתהיה ב ${blessingType} באוירה ${atmosphere}`;
        if (age) {
            thread += ` לגיל ${age}`;
        }
        if (teacherType) {
            thread += ` ל ${teacherType}`;
        }
        thread += ` באורך של בערך ${greetingLength} מילים`;

    
        try {
            const openAIResult = await callOpenAI(thread);
            const parsedResult = JSON.parse(openAIResult);
            
            let newResults = [];
    
            if (Array.isArray(parsedResult.greetings)) {
                // מקרה של מערך של אובייקטים
                newResults = parsedResult.greetings;
            } else if (typeof parsedResult.greetings === 'object') {
                // מקרה של אובייקט של מערכים
                newResults = Object.values(parsedResult.greetings);
            } else if (parsedResult.greeting1) {
                // מקרה של אובייקט עם greeting1, greeting2, greeting3
                newResults = [
                    parsedResult.greeting1,
                    parsedResult.greeting2,
                    parsedResult.greeting3
                ].filter(Boolean); // מסיר ערכים ריקים או null
            } else {
                // מקרה לא צפוי
                newResults = [JSON.stringify(parsedResult)];
            }
    
            // וודאי שכל איבר במערך הוא אובייקט עם שדה 'message'
            newResults = newResults.map(greeting => {
                if (typeof greeting === 'string') {
                    return { message: greeting };
                } else if (typeof greeting === 'object' && greeting.message) {
                    return greeting;
                } else {
                    return { message: JSON.stringify(greeting) };
                }
            });
    
            setResult(newResults);
        } catch (error) {
            console.error("error in handeleSearchBlessing", error);
            setResult([{ message: "ארעה שגיאה בעת הפניה ל OpenAI" }]);
        } finally {
            setIsLoading(false);
        }
    
    };

    const handleNextGreeting = () => {
            setCurrentGreetingIndex((prevIndex) => (prevIndex + 1) % result.length);
        };


    return (
        <>
            <div className={`blessing-container ${result.length > 0 ? 'result-view' : ''}`}>
                <h1>ברכות ואיחולים</h1>

                <div className={`input-fields ${result.length > 0 ? 'compact' : ''}`}>
                    <FormControl className="form-control" fullWidth>
                        <label className="input-label">אני רוצה את הברכה עבור</label>
                        <Select
                            className="select"
                            value={type}
                            onChange={handleChange}
                            required
                        >
                            {types.map((t) =>
                                <MenuItem key={t.id} value={t.id}>
                                    {t.name}
                                </MenuItem>)}
                        </Select>
                    </FormControl>

                    {showTypesTeacher && (
                        <div className="form-control">
                            <label className="input-label">לכבוד</label>
                            <Select
                                className="select"
                                id=" typesTeacher"
                                value={teacher}
                                onChange={handleTeacherChange}
                                required
                            >
                                {typesTeacher.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>
                                        {t.name}
                                    </MenuItem>))}
                            </Select>
                        </div>
                    )}


                    {showAgeField && (

                        <div className="form-control">
                            <label className="input-label">גיל</label>
                            <input className="text-field" type="number" id="age-input" />
                        </div>

                    )}
                    <div className="form-control">
                        <label className="input-label" >פרט איזה סגנון ברכה אתה רוצה:</label>
                        <input className="text-field" type="text" id="blessing-type-input" />
                        <p className='note'>שיר, קצר, ארוך, מכתב ועוד</p>
                        <div className="form-control">
                            <label className="input-label">אווירה</label>
                            <input className="text-field" type="text" id="atmosphere-input" />
                            <p className='note'>קליל, שמח, חרוזים ועוד</p>

                        </div>

                        <label>אורך הברכה (במילים):{greetingLength}</label>

                        <Slider
                            value={greetingLength}
                            onChange={handleGreetingLengthChange}
                            aria-label="אורך הברכה"
                            valueLabelDisplay="auto"
                            min={10}
                            max={200}
                        />
                    </div>


                    <button className="button" onClick={handeleSearchBlessing} disabled={isLoading}>
                        {isLoading ? 'מחפש...' : 'חפש'}
                    </button>
                </div>
                {result.length > 0 && (//רנדור של התוצאה
                <div className="greeting-container">
                    <div className="greeting-result">
                        {result[currentGreetingIndex].message}
                    </div>
                    {result.length > 1 && (

                    <Button 
                        onClick={handleNextGreeting} 
                        variant="contained" 
                        color="primary"
                        disabled={currentGreetingIndex>=result.length-1}//בסוף הכפתור יושבת
                    >
                        
                        {currentGreetingIndex < result.length - 1 ? 'הברכה הבאה' : 'חזור לברכה הראשונה'}
                    </Button>)}
                </div>
                )}
            </div>

            </>
            )

} export default Home;

