import { Card, CardBody } from "@heroui/card";

export default function ConfirmEmail() {
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="grid h-[400px] w-[400px] justify-center">
                <CardBody>
                    <p>Мы отправили вам письмо на почту для подтверждения вашего аккаунта.</p>
                    <p>Можете закрыть эту страницу.</p>
                </CardBody>
            </Card>
        </div>
    );
}
