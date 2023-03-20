# Prompt

### IN DEVELOPMENT - NOT STABLE

TODO
* Get list of models from rest API
* Make sure the selection of fine tuned models works
* Add rate limiting information - request a minute, tokens a minute
* Add requesting limiting with a que
* Honour any back-off responses from server - if there is one
* Request retry after fixed period. 
* ~~Add Prompt hash ~~
* ~~Add Cache interface~~
* ~~Add simple json file cache~~


This is a javascript version of Promptify - https://github.com/promptslab/Promptify

```
import {OpenAI, Prompter} from Promptify

const sentence = 'The patient is a 93-year-old female with a medical history of chronic right hip pain, osteoporosis,	hypertension, depression, and chronic atrial fibrillation admitted for evaluation and management of severe nausea and vomiting and urinary tract infection'

model = OpenAI(api_key)
nlpPrompter = Prompter(model)

result = nlpPrompter.fit('ner.njk', {
    domain: 'medical',
    textInput: sentence,
})
                                             
### Output

[{'E': '93-year-old', 'T': 'Age'},
 {'E': 'chronic right hip pain', 'T': 'Medical Condition'},
 {'E': 'osteoporosis', 'T': 'Medical Condition'},
 {'E': 'hypertension', 'T': 'Medical Condition'},
 {'E': 'depression', 'T': 'Medical Condition'},
 {'E': 'chronic atrial fibrillation', 'T': 'Medical Condition'},
 {'E': 'severe nausea and vomiting', 'T': 'Symptom'},
 {'E': 'urinary tract infection', 'T': 'Medical Condition'},
 {'Branch': 'Internal Medicine', 'Group': 'Geriatrics'}]
 ```