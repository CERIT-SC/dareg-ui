import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useGetProfileQuery } from '../Services/profile';

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}
type AvatarProps = {
  size?: number
}
const useAvatar = ({size}: AvatarProps) => {
    const auth = useAuth();
    const profile = useGetProfileQuery(1);
    
    const [avatarComponent, setAvatarComponent] = useState<JSX.Element>();
    const avatarUrl = `${profile.data?.results[0].avatar}?d=404&size=${size}`
  
    const stringAvatar = (first: string, last:string) => {
        return {
          sx: {
            bgcolor: stringToColor(first+" "+last),
            width: size ? size : 48,
            height: size ? size : 48,
          },
          children: `${first[0]}${last[0]}`,
        };
    }

    useEffect(() => {
      if (!auth.isAuthenticated) return;
      const tmp = <Avatar src={avatarUrl as string} {...stringAvatar(auth.user?.profile.given_name || "U", auth.user?.profile.family_name || "N")} />;
      setAvatarComponent(tmp);
    }, [auth.isAuthenticated, avatarUrl]);


    return {
            avatarComponent,
            avatarUrl
    };
}

export default useAvatar;