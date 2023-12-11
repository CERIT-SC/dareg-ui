import { NavigateNextRounded } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const MyBreadcrumbs = (props: {
  path: { url: string, name: string }[],
  current: string
}) => {

  return (
    <Breadcrumbs separator={<NavigateNextRounded fontSize="small" />}>
      {props.path.map((item: { url: string, name: string }) => (
        <Link underline="hover" color="inherit">{item.name}</Link>
      ))}
      <Typography variant="h4" fontSize={30} color="text.primary" mb={0}>{props.current}</Typography>
    </Breadcrumbs>
  )
};

export default MyBreadcrumbs;