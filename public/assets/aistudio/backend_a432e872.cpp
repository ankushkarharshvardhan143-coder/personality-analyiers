#include "backend.h"

#include <fstream>
#include <ctime>

using namespace std;

namespace {
const string traitNames[TRAIT_COUNT] = {
    "Introvert", "Extrovert", "Leader", "Creative"
};

const string traitDescriptions[TRAIT_COUNT] = {
    "You may prefer reflection, focused work and meaningful one-to-one conversations. You often think carefully before responding.",
    "You may enjoy social interaction, teamwork and communication. You often feel energised when sharing ideas with people.",
    "You may enjoy responsibility, planning and decision-making. You often help a group move toward a clear goal.",
    "You may enjoy imagination, experimentation and original ideas. You often look for fresh ways to approach a challenge."
};

const Question questions[QUESTION_COUNT] = {
    {"How do you prefer to spend your free time?",
     {"Reading or reflecting", "Meeting friends", "Organising an activity", "Trying a new hobby"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"In a group project, you usually...",
     {"Work independently on your part", "Help everyone communicate", "Coordinate the team", "Suggest unusual ideas"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"When facing a difficult problem, you...",
     {"Think quietly before acting", "Discuss it with others", "Make a plan and take charge", "Experiment with different solutions"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Which environment do you enjoy most?",
     {"A calm and quiet place", "A lively social setting", "A goal-oriented workplace", "An inspiring and artistic space"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"When meeting new people, you...",
     {"Take time to open up", "Start conversations easily", "Confidently introduce yourself", "Look for interesting shared ideas"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"What motivates you the most?",
     {"Personal understanding", "Connecting with people", "Achieving goals", "Creating something original"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Your ideal weekend is...",
     {"A peaceful day to recharge", "A get-together with friends", "A planned outing or challenge", "Exploring a new experience"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"If plans suddenly change, you...",
     {"Prefer time to adjust", "Quickly talk it through", "Reorganise the plan", "Enjoy the unexpected change"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"In a discussion, you tend to...",
     {"Listen and speak thoughtfully", "Participate actively", "Guide the discussion", "Offer fresh perspectives"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Which strength describes you best?",
     {"Concentration", "Communication", "Decision-making", "Imagination"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"When learning something new, you prefer...",
     {"Studying it on your own", "Learning with a group", "Following a clear plan", "Learning by experimenting"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"If your team is confused, you...",
     {"First understand the issue", "Encourage everyone to share", "Assign clear next steps", "Suggest a different approach"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Which task sounds most enjoyable?",
     {"Research and analysis", "Networking and presenting", "Planning and managing", "Designing and inventing"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"How do you make important decisions?",
     {"Reflect carefully by yourself", "Talk with trusted people", "Compare options and decide", "Consider imaginative possibilities"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"At a social event, you are likely to...",
     {"Stay with a few familiar people", "Meet many new people", "Help organise activities", "Enjoy creative or unusual activities"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"What do people often appreciate about you?",
     {"Thoughtful nature", "Friendly attitude", "Reliability and direction", "Original ideas"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"When you have a deadline, you...",
     {"Work best with quiet focus", "Discuss progress with others", "Create a schedule and track it", "Find an interesting way to finish"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Which role would you choose?",
     {"Research specialist", "Community coordinator", "Team captain", "Creative designer"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"When you disagree with someone, you...",
     {"Think before responding", "Try to maintain a friendly conversation", "Explain your position firmly", "Look for an alternative idea"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}},
    {"Which statement sounds most like you?",
     {"I value depth and reflection", "I gain energy from interaction", "I like taking responsibility", "I enjoy exploring possibilities"},
     {INTROVERT, EXTROVERT, LEADER, CREATIVE}}
};

void merge(TraitScore a[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<TraitScore> L(n1), R(n2);
    for (int i = 0; i < n1; ++i) L[i] = a[left + i];
    for (int j = 0; j < n2; ++j) R[j] = a[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        // Descending order; left side wins ties (stable merge).
        if (L[i].score >= R[j].score) a[k++] = L[i++];
        else a[k++] = R[j++];
    }
    while (i < n1) a[k++] = L[i++];
    while (j < n2) a[k++] = R[j++];
}
}

const Question* getQuestions() { return questions; }
const string* getTraitNames() { return traitNames; }
const string* getTraitDescriptions() { return traitDescriptions; }

void initializeScores(int scores[TRAIT_COUNT]) {
    for (int i = 0; i < TRAIT_COUNT; ++i) scores[i] = 0;
}

void recordAnswer(int scores[TRAIT_COUNT], int questionIndex, int optionIndex) {
    if (questionIndex < 0 || questionIndex >= QUESTION_COUNT) return;
    if (optionIndex < 0 || optionIndex >= 4) return;
    int trait = questions[questionIndex].traitForOption[optionIndex];
    ++scores[trait];
}

int greedyDominantTrait(const TraitScore traits[], int count) {
    if (count <= 0) return -1;
    int best = 0;
    for (int i = 1; i < count; ++i) {
        if (traits[i].score > traits[best].score) best = i;
    }
    return best;
}

void mergeSortTraits(TraitScore traits[], int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSortTraits(traits, left, mid);
    mergeSortTraits(traits, mid + 1, right);
    merge(traits, left, mid, right);
}

void buildTraitScores(const int scores[TRAIT_COUNT],
                      TraitScore traits[TRAIT_COUNT]) {
    for (int i = 0; i < TRAIT_COUNT; ++i) {
        traits[i].name = traitNames[i];
        traits[i].score = scores[i];
        traits[i].description = traitDescriptions[i];
    }
}

bool saveResultCSV(const string& userName,
                   const TraitScore ranked[TRAIT_COUNT]) {
    ofstream out("personality_results.csv", ios::app);
    if (!out) return false;

    time_t now = time(NULL);
    tm* local = localtime(&now);
    char timestamp[32];
    strftime(timestamp, sizeof(timestamp), "%Y-%m-%d %H:%M:%S", local);

    // Quote name so commas in names do not break the CSV columns.
    string safeName;
    for (char c : userName) {
        if (c == '"') safeName += "\"\"";
        else safeName += c;
    }

    out << '"' << safeName << '"' << ',' << timestamp;
    for (int i = 0; i < TRAIT_COUNT; ++i)
        out << ',' << ranked[i].name << ',' << ranked[i].score;
    out << '\n';
    return static_cast<bool>(out);
}
