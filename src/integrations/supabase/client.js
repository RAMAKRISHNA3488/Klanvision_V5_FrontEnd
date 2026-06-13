// Supabase client bridge that routes all queries to the Cloudflare Workers backend API
import { api } from "../../utils/api";

const createQueryBuilder = (table, selectStr = "*", selectOptions = {}) => {
  const filters = {};

  const execute = async (mode = "list") => {
    try {
      if (table === "tests") {
        if (filters.id) {
          const data = await api.getExam(filters.id);
          return { data, error: null };
        }
        return { data: null, error: new Error("No ID specified for tests") };
      }

      if (table === "attempts") {
        const countOnly = selectOptions.count === "exact";
        const result = await api.getAttempts(
          filters.test_id || "",
          filters.student_id || "",
          filters.status || "",
          countOnly
        );
        if (countOnly) {
          return { count: result.count, error: null };
        }
        if (mode === "single" || mode === "maybeSingle") {
          return { data: result[0] || null, error: null };
        }
        return { data: result, error: null };
      }

      if (table === "attempt_answers") {
        const data = await api.getAttemptAnswers(filters.attempt_id || "");
        return { data, error: null };
      }

      if (table === "test_questions") {
        const questions = await api.getExamQuestions(filters.test_id || "");
        // Format to match Supabase's joins: { questions: { id, correct_answer, marks } }
        const data = questions.map(q => ({
          questions: {
            id: q.id,
            correct_answer: q.correct_answer,
            marks: q.marks
          }
        }));
        return { data, error: null };
      }

      return { data: null, error: new Error(`Table not implemented: ${table}`) };
    } catch (err) {
      console.error(`Error in Supabase bridge for table ${table}:`, err);
      return { data: null, error: err, count: 0 };
    }
  };

  const builder = {
    eq: (field, val) => {
      filters[field] = val;
      return builder;
    },
    single: () => execute("single"),
    maybeSingle: () => execute("maybeSingle"),
    // Thenable implementation to support direct await on builder/eq
    then: (resolve, reject) => {
      execute("list").then(resolve, reject);
    }
  };

  return builder;
};

export const supabase = {
  from: (table) => {
    return {
      select: (selectStr = "*", selectOptions = {}) => {
        return createQueryBuilder(table, selectStr, selectOptions);
      },
      upsert: async (data, options = {}) => {
        if (table === "profiles") {
          try {
            await api.upsertProfile(data);
            return { error: null };
          } catch (err) {
            return { error: err };
          }
        }
        
        if (table === "attempt_answers") {
          try {
            await api.upsertAttemptAnswers(data);
            return { error: null };
          } catch (err) {
            return { error: err };
          }
        }
        return { error: null };
      },
      insert: (data) => {
        return {
          select: () => {
            return {
              single: async () => {
                if (table === "attempts") {
                  try {
                    const newAttempt = await api.createAttempt(data);
                    return { data: newAttempt, error: null };
                  } catch (err) {
                    return { data: null, error: err };
                  }
                }
                return { data: null, error: new Error("Insert failed") };
              }
            };
          }
        };
      }
    };
  },
  rpc: async (fnName, params) => {
    if (fnName === "get_test_questions_for_student") {
      try {
        const data = await api.getExamQuestions(params._test_id);
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    }
    
    if (fnName === "submit_test_attempt") {
      try {
        await api.submitAttempt(params._attempt_id, params._time_taken);
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    }
    
    return { data: null, error: null };
  }
};
