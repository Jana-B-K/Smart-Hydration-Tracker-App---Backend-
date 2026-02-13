const DEFAULT_PROFILE = {
  baseAdd: 0,
  multiplier: 1,
  reminderInterval: 90,
};

const USER_TYPE_CONFIG = {
  Athlete: {
    baseAdd: 0.7,
    multiplier: 1.2,
    reminderInterval: 45,
  },
  "Office worker": {
    baseAdd: 0,
    multiplier: 0.95,
    reminderInterval: 120,
  },
  "Outdoor worker": {
    baseAdd: 0.5,
    multiplier: 1.15,
    reminderInterval: 60,
  },
  Pregnant: {
    baseAdd: 0.7,
    multiplier: 1.15,
    reminderInterval: 90,
  },
  "Senior citizen": {
    baseAdd: 0.2,
    multiplier: 0.9,
    reminderInterval: 120,
  },
};

export function getUserTypeConfig(userType) {
  return USER_TYPE_CONFIG[userType] ?? DEFAULT_PROFILE;
}
