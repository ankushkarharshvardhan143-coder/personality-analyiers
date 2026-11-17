# Test Cases

| ID | Scenario | Input | Expected result |
|---|---|---|---|
| TC01 | Introvert highest | Scores 12,4,2,2 | Introvert ranked first |
| TC02 | Extrovert highest | Scores 3,12,3,2 | Extrovert ranked first |
| TC03 | Leader highest | Scores 2,3,12,3 | Leader ranked first |
| TC04 | Creative highest | Scores 2,3,3,12 | Creative ranked first |
| TC05 | Equal scores | Scores 5,5,5,5 | Introvert first due to fixed tie order |
| TC06 | Two-way maximum tie | Scores 8,8,2,2 | Introvert first due to fixed tie order |
| TC07 | Complete quiz | Answer all 20 questions | Result screen; total score = 20 |
| TC08 | Blank name | Press Enter without typing | Name becomes Guest |
| TC09 | CSV save | Complete two sessions | Two result rows appended |
| TC10 | Keyboard input | Keys 1–4 and Enter | Chosen answer is recorded |
| TC11 | Mouse input | Click answer and NEXT | Chosen answer is recorded |
| TC12 | Cancel | Press Esc in quiz | No completed result is saved |

Algorithm verification: Greedy result score must equal the maximum input score. Merge Sort output must be non-increasing by score. Equal-score elements retain their input order.
