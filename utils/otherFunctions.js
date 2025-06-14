export function addDesignationToSem(sem) {
  if (sem === "1") {
    return {
      inWords: "First Semester",
      inMixed: "1st Semester",
      inShort: "st",
      inSlug: "1stsem",
    };
  } else if (sem === "2") {
    return {
      inWords: "Second Semester",
      inMixed: "2nd Semester",
      inShort: "nd",
      inSlug: "2ndsem",
    };
  } else if (sem === "3") {
    return {
      inWords: "Third Semester",
      inMixed: "3rd Semester",
      inShort: "rd",
      inSlug: "3rdsem",
    };
  } else if (sem === "4") {
    return {
      inWords: "Fourth Semester",
      inMixed: "4th Semester",
      inShort: "th",
      inSlug: "4thsem",
    };
  } else if (sem === "5") {
    return {
      inWords: "Fifth Semester",
      inMixed: "5th Semester",
      inShort: "th",
      inSlug: "5thsem",
    };
  } else if (sem === "6") {
    return {
      inWords: "Sixth Semester",
      inMixed: "6th Semester",
      inShort: "th",
      inSlug: "6thsem",
    };
  }

  return sem;
}
