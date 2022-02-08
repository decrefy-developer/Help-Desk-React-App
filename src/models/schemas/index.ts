import * as yup from "yup";
import moment from "moment";
const dateNow = moment().toISOString();

export const schemaAccount = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password is too short - should be 6 chars minimum.")
    .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const schemaChannel = yup.object().shape({
  teamId: yup.string().required("Team is required"),
  name: yup.string().required("Channel name is required").min(5),
});

export const schemaLogin = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const schemaTeam = yup.object().shape({
  name: yup.string().required("Team name is required").min(5),
});

export const schemaTicket = yup.object().shape({
  customerId: yup.string().required("Customer is required"),
  categoryId: yup.string().required("Major Category is required"),
  description: yup.string().required("Description is required"),
  teamId: yup.string().required("Team is required"),
  channelId: yup.string().required("Channel is required"),
  coworkers: yup.array().of(yup.string()),
  startDate: yup
    .date()
    .required("The start date is required")
    .min(
      dateNow,
      "Please check the start date; it should not be lower today. "
    ),
  targetDate: yup
    .date()
    .required("The target date is required")
    .min(
      dateNow,
      "Please check the target date; it should not be lower today. "
    ),
  // createdBy: yup.string().required("created by is required"),
});
