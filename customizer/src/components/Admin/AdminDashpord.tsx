import React from "react";
import {Button, Link} from "@nextui-org/react"

function AdminDashpord(props: any) {
    return (
        <>
            <Button
                showAnchorIcon
                as={Link}
                color="primary"
                href="/blade-shapes"
                variant="solid"
            >
                Форми клинків
            </Button>
            <Button
                showAnchorIcon
                as={Link}
                color="primary"
                href="/handle-colors"
                variant="solid"
            >
                Кольори руків'я
            </Button>
            <Button
                showAnchorIcon
                as={Link}
                color="primary"
                href="/sheath-colors"
                variant="solid"
            >
                Кольори піхв
            </Button>
            <Button
                showAnchorIcon
                as={Link}
                color="primary"
                variant="solid"
                href="/blade-coating"
            >
                Покриття клинків
            </Button>
            <Button
                showAnchorIcon
                as={Link}
                color="primary"
                href="/fastening"
                variant="solid"
            >
                Кріплення
            </Button>
        </>
    )
}

export  default  AdminDashpord;