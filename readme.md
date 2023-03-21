# Prompt

### IN DEVELOPMENT - NOT STABLE

TODO
* ~~Get list of models from rest API~~
* ~~Selection of fine tuned models works~~
* Add rate limiting information - request a minute, tokens a minute
* Add requesting limiting with a que
* Honour any back-off responses from server - if there is one
* ~~Request retry after fixed period~~
* ~~Add Prompt hash~~
* ~~Add Cache interface~~
* ~~Add simple json file cache~~


This is a javascript version of Promptify - https://github.com/promptslab/Promptify

```
import {OpenAI, Prompter} from prompt

const sentence = 'The patient is a 93-year-old female with a medical history of chronic right hip pain, osteoporosis,	hypertension, depression, and chronic atrial fibrillation admitted for evaluation and management of severe nausea and vomiting and urinary tract infection'

model = OpenAI(api_key)
nlpPrompter = Prompter(model)

let result = await nlpPrompter.fit('ner.njk', {
    domain: 'medical',
    textInput: sentence,
})

                                             
### Output

[{'text': '93-year-old', 'label': 'Age'},
 {'text': 'chronic right hip pain', 'label': 'Medical Condition'},
 {'text': 'osteoporosis', 'label': 'Medical Condition'},
 {'text': 'hypertension', 'label': 'Medical Condition'},
 {'text': 'depression', 'label': 'Medical Condition'},
 {'text': 'chronic atrial fibrillation', 'label': 'Medical Condition'},
 {'text': 'severe nausea and vomiting', 'label': 'Symptom'},
 {'text': 'urinary tract infection', 'label': 'Medical Condition'},
 {'branch': 'Internal Medicine', 'group': 'Geriatrics'}]
 ```