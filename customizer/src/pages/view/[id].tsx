import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import { useRouter } from "next/router";
import React from "react";

const ViewPage = () => {
    const router = useRouter();
    let { id } = router.query;
    id = id as string;
    return (
        <div className="w-full" style={{ height: "80vh" }}>
            <KnifeConfigurator productId={id} />
        </div>
    );
}

export default ViewPage;