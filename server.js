import express from 'express'
import { json, urlencoded } from 'body-parser'
import { get_data, insert_data } from "./database";


const app = express()
const port = 8000

app.use(json())
app.use(
    urlencoded({
        extended: true,
    })
)


app.get('/api', async (req, res) => {

    const r = await get_data('todo_list');

    return res.send(r)
})
app.post('/api/add', async (req, res) => {
    const task_name = req.body.newItem
    const r = await insert_data({ task_name: task_name, is_task_done: false });
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

