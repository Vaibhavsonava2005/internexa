import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeName: z.string().min(2, "College name is required"),
  university: z.string().min(2, "University name is required"),
  currentSemester: z.string().min(1, "Current semester is required"),
  degree: z.string().min(2, "Degree is required"),
  branch: z.string().min(2, "Branch is required"),
  expectedGraduationYear: z.string().length(4, "Must be a valid 4-digit year"),
  currentSkills: z.string().min(2, "Please list your current skills"),
  githubProfile: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinProfile: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  preferredDomain: z.string().min(2, "Preferred domain is required"),
  preferredStartDate: z.string().min(2, "Start date is required"),
  availableHours: z.string().min(1, "Available hours is required"),
  preferredDuration: z.string().min(1, "Preferred duration is required"),
  careerGoals: z.string().min(10, "Please briefly describe your career goals"),
  whyJoin: z.string().min(10, "Please tell us why you want to join"),
  previousExperience: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
