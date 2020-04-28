import Company from '../schemas/Company';

export default async (req, res, next) => {
  const isAdmin = await Company.findById(req.idCompany).and({
    admin: true,
  });

  if (!isAdmin) {
    return res
      .status(401)
      .json({ error: 'Only users with status of admin can access this page!' });
  }

  return next();
};
