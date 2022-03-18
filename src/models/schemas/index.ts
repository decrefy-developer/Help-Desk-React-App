import { string, object, boolean, array, ref, date } from "yup";
import moment from "moment";
const dateNow = moment().toISOString();

export const schemaAccount = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  departmentId: string().required("Department is required"),
  unitId: string(),
  email: string().email().required("Email is required"),
  password: string()
    .required("Password is required")
    .min(5, "Password is too short - should be 6 chars minimum.")
    .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
  confirmPassword: string()
    .oneOf([ref("password"), null], "Passwords must match").required(),
});

export const schemaChannel = object().shape({
  teamId: string().required("Team is required"),
  name: string().required("Channel name is required").min(5),
});

export const schemaLogin = object().shape({
  email: string().email().required(),
  password: string().required(),
});

export const schemaTeam = object().shape({
  name: string().required("Team name is required").min(5),
});

export const schemaDepartment = object().shape({
  name: string().required("Department name is required").min(3),
});

// export const schemaUnit = object().shape({
//   name: string().required("Unit name is required"),
// })

export const schemaTicket = object().shape({
  description: string().required("Description is required"),
  categoryId: string().required("Major Category is required"),
  teamId: string().required("Team is required"),
  channelId: string().required("Channel is required"),
  userId: string().required("user is required"),
  coworkers: array().of(string()),
  startDate: date()
    .required("The start date is required")
    .min(
      dateNow,
      "Please check the start date; it should not be lower today. "
    ),
  targetDate: date()
    .required("The target date is required")
    .min(
      dateNow,
      "Please check the target date; it should not be lower today. "
    ),
});

export const schemaAddMemberToChannel = object().shape({
  member: object()
    .shape({
      value: string(),
      label: string(),
    })
    .required("member is required"),
  isAdmin: boolean().required("Role is required"),
});


export const schemaGenerateReport = object().shape({
  teamId: string().required("Team is required"),
  channelId: string().required("Channel is required"),
  date: date()
    .required("The date is required")
    .min(
      dateNow,
      "Please check the date; it should not be lower today. "
    ),
})