import { Link } from "react-router-dom";
import PoolsList from "src/components/pools/PoolsList";
import { Button } from "src/components/ui/Button";

const PoolsPage = () => {
    return (
        <>
            <div className="w-full flex flex-col gap-6 py-20 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl mr-auto">Pools</h2>
                    <Link to="/create-pool">
                        <Button className="rounded-xl">Create Pool</Button>
                    </Link>
                </div>

                <div className="pb-5 bg-light border-2 border-border-light rounded-2xl">
                    <PoolsList />
                </div>
            </div>
        </>
    );
};

export default PoolsPage;
