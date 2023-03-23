import { Card, CardContent } from "@mui/material";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useStateContext } from "../../components/contexts/ContextProvider";

export default function Header() {
    const {pageName} = useStateContext();
    return (
        <Card 
            sx={{
                position:'sticky',
                top:0,
                opacity:0.98,
                zIndex:2,
                p:0,
                boxShadow:'none',
                border:'none',
                borderRadius:0,
                width:'100%',
            }}
        >
            <CardContent sx={{p:0, '&:last-child':{pb:0}}}>
                <Toolbar>          
                    <Typography variant="h6" noWrap component="div">
                    {pageName}
                    </Typography>
                </Toolbar>   
            </CardContent>
        </Card>     
    );
}