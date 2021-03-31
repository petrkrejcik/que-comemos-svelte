export const User = (data) => {
  const user = { email: data.email };

  return {
    ...user,
  };
};
