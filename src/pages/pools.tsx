import PoolsList from "src/components/pools/PoolsList";

const PoolsPage = () => {
    return (
        <>
            <div className="w-full flex flex-col gap-6 py-20 animate-fade-in">
                <h2 className="text-3xl mr-auto">Pools</h2>
                <div className="pb-5 bg-light border-2 border-border-light rounded-2xl">
                    <PoolsList />
                </div>
            </div>
        </>
    );
};

export default PoolsPage;
