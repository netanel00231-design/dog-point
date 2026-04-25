require('dotenv').config();
const express = require('express');
const path    = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app    = express();
const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

const SYSTEM_PROMPT = `אתה עוזר וירטואלי של DogPoint — מרכז האילוף של דור קליין.
תענה תמיד בעברית, בצורה ידידותית וחמה.

מידע על הקורס "אילוף כלבים בגובה העיניים":
• 4 תחומים עיקריים: שיקום כלבים, בעיות התנהגות, ספורט כלבני, תקשורת בין כלבים
• מיקום: מושב גילת, דרום ישראל — שיעורים פרונטליים בלבד, בשטח פתוח
• בסיום מקבלים תעודת מאלף מוסמכת
• הקורס פתוח גם לאנשים ללא שום ניסיון קודם

מידע על דור קליין:
• גיל 32, תושב מושב גילת
• 10 שנות ניסיון בשטח, עבד עם מעל 10,000 כלבים
• מומחה לספורט כלבני (אגיליטי ועוד) ברמה לאומית
• גישה: "בגובה העיניים" — אנושית, מכבדת וללא כפייה

שוק והכנסה:
• תחום האילוף בישראל חם מאוד — ביקוש גבוה, היצע נמוך
• בוגרים עובדים כשכירים בפנסיון/מרכז כלבים, או כעצמאיים עם לקוחות פרטיים
• פוטנציאל הכנסה גבוה מאוד — זה מקצוע אמיתי ולא "תחביב עם תעודה"

ליצירת קשר:
• וואטסאפ: 055-7048141 | https://wa.me/972557048141
• אינסטגרם: @dogpoint_center_training

הנחיות:
1. תשובות קצרות — עד 3-4 משפטים
2. השתמש באימוג'ים במידה
3. שאלות על מחיר → הפנה לוואטסאפ: https://wa.me/972557048141?text=שלום דור, אני רוצה לשמוע על מחיר הקורס
4. שאלות על תאריכים → הפנה לוואטסאפ
5. אל תמציא מידע שלא נמסר לך — הפנה לדור`;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-8)
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: 'upstream API error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DogPoint running on http://localhost:${PORT}`));
