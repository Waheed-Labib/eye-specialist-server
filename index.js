const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 5000;

app.use(cors())

app.get('/', (req, res) => {
    res.send('Eye Specialist Server runing');
})

const services = [
    {
        id: 1,
        name: 'Cataract',
        price: 200,
        description: 'A condition affecting the eye that causes clouding of the lens. A gradual progression of vision problem, eventually, if not treated, may result in vision loss. Treatment often requires lab test or imaging./pIn Dr. Bean Eye Consultation Center, Patients receive the most technologically advanced care available in a safe and caring environment. The surgery center is designed specifically for cataract surgery and is accredited for the highest quality care possible./pWhether this is your first consult or you are interested in a second opinion, you can trust your eyes to Dr. Bean.',
        image: ''
    },
    {
        id: 2,
        name: 'Lens Exchange',
        price: 100,
        description: 'Are glasses and contact lenses affecting your lifestyle? Dr. Bean offers the most advanced laser surgery procedures to improve your vision and say goodbye to glasses./pWhether this is your first consult or you are interested in a second opinion, you can trust your eyes to Dr. Bean.',
        image: ''
    },
    {
        id: 3,
        name: 'Lasik',
        price: 150,
        description: 'Improve your vision with LASIK (Laser in Situ Keratomileusis) surgery that corrects nearsightedness, farsightedness and astigmatism with a minor all-laser outpatient procedure. Call Dr. Bean today to schedule your consultation./p Dr. Bean uses the latest femtosecond laser or “bladeless” technology. Your vision is corrected almost immediately following surgery and in most cases, you can be back to work the next day./pEnjoy activities without having to worry about your vision!',
        image: ''
    },
    {
        id: 4,
        name: 'Glaucoma',
        price: 250,
        description: 'A condition where the eye’s optic nerve, which provides information to the brain, is damaged with or without raised intraocular pressure. If untreated, this will cause gradual vision loss. Glaucoma is the second leading cause of blindness in the United States and the most common among African-Americans./pDr. Bean offers patients compassionate care in a comfortable environment.',
        image: ''
    }
]

app.get('/services', (req, res) => {
    res.send(services)
})

app.listen(port, () => {
    console.log('Eye Specialist Server running on port', port);
})