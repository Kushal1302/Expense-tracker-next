import bcrypt from "bcrypt";
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const hashedPassword = async (pass: string) => {
  return await bcrypt.hash(pass, 10);
};
