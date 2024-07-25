import fetch from 'node-fetch';

import { RAE } from 'rae-api'




export default function handler(req, res) {
    // console.log(req.body  )


    async function getRAE() {
        const rae = new RAE();
        const search = await rae.searchWord(req.body.word);
        const wordId = search.getRes()[0].getId(); // gets 'hola' word id

        const result = await rae.fetchWord(wordId); // fetches the word as object
        const definitions = result.getDefinitions(); // gets all 'hola' definitions as Defintion[]
        const data = definitions[0].getDefinition(); // gets the first 'hola' definition as string
        res.json({data})

    }

    getRAE()
}






