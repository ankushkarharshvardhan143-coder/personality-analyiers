#ifndef PERSONALITY_BACKEND_H
#define PERSONALITY_BACKEND_H

#include <string>
#include <vector>

enum Trait {
    INTROVERT = 0,
    EXTROVERT = 1,
    LEADER = 2,
    CREATIVE = 3
};

struct Question {
    std::string prompt;
    std::string options[4];
    int traitForOption[4];
};

struct TraitScore {
    std::string name;
    int score;
    std::string description;
};

const int QUESTION_COUNT = 20;
const int TRAIT_COUNT = 4;

const Question* getQuestions();
const std::string* getTraitNames();
const std::string* getTraitDescriptions();

void initializeScores(int scores[TRAIT_COUNT]);
void recordAnswer(int scores[TRAIT_COUNT], int questionIndex, int optionIndex);

// DAA: Greedy method. Returns the first maximum-scoring trait index.
int greedyDominantTrait(const TraitScore traits[], int count);

// DAA: Divide and Conquer. Sorts traits in descending order by score.
void mergeSortTraits(TraitScore traits[], int left, int right);

void buildTraitScores(const int scores[TRAIT_COUNT],
                      TraitScore traits[TRAIT_COUNT]);

bool saveResultCSV(const std::string& userName,
                   const TraitScore ranked[TRAIT_COUNT]);

#endif
