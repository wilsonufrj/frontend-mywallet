import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { getDadosUsuario } from "./homeSlice";
import { Card } from "primereact/card";



const Home = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDadosUsuario())
    })

    return (
        <div className="p-4">
            <div className="grid">
                <div className="col-3">
                    <Card title="Janeiro"></Card>
                </div>
            </div>
        </div>
    )
}

export default Home;