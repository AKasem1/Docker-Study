const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.json([
    {
      "id":"1",
      "title":"Book Review: The Bear & The Nightingale"
    },
    {
      "id":"2",
      "title":"Game Review: Pokemon Brillian Diamond"
    },
    {
      "id":"3",
      "title":"Show Review: Alice in Borderland"
    },
    {
      "id":"4",
      "title":"Movie Review: Dune: Part Two"
    },
    {
      "id":"5",
      "title":"Game Review: Mario vs Donkey Kong"
    },
    {
      "id":"6",
      "title":"Game Review: Mario vs Donkey Kong"
    }
  ])
})

app.listen(4000, () => {
  console.log('listening for requests on port 4000....')
})