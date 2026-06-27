import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeName: z.string().min(2, "College name is required"),
  university: z.string().optional(),
  currentSemester: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  expectedGraduationYear: z.string().optional(),
  currentSkills: z.string().optional(),
  githubProfile: z.string().optional(),
  linkedinProfile: z.string().optional(),
  portfolio: z.string().optional(),
  preferredDomain: z.string().optional(),
  preferredStartDate: z.string().optional(),
  availableHours: z.string().optional(),
  preferredDuration: z.string().optional(),
  careerGoals: z.string().optional(),
  whyJoin: z.string().optional(),
  previousExperience: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
