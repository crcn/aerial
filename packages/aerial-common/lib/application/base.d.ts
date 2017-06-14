import { IBrokerBus } from "../busses";
import { Kernel } from '../ioc';
/**
 */
export declare class Application {
    readonly kernel: Kernel;
    readonly bus: IBrokerBus;
    private _initialized;
    constructor(kernel: Kernel);
    /**
     * Bootstraps the application
     */
    initialize(): Promise<void>;
    /**
     */
    protected willLoad(): void;
    /**
     */
    protected didLoad(): void;
    /**
     */
    protected willInitialize(): void;
    /**
     */
    protected didInitialize(): void;
}
export declare class ServiceApplication extends Application {
    willLoad(): void;
}
