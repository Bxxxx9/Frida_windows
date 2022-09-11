class HOOK {
    private processName = "winmine.exe";
    private Basemodule: Module;
    constructor() {
        this.Basemodule = Process.getModuleByName(this.processName);
    }

    readProcess() {
        let height = this.Basemodule.base.add(0x5338).readU32();
        console.log("height:", height);

        let width = this.Basemodule.base.add(0x5334).readU32();
        console.log("width:", width);

        let mine_count = this.Basemodule.base.add(0x5330).readU32();
        console.log("mine_count:", mine_count);

        let head = this.Basemodule.base.add(0x5340);
        console.log("head:", head);

        
        for (let i = 0; i < height + 2; i++) {
            
            let data = [];
            for (let j = 0; j < width + 2; j++) {
                let byte_data = head.add(j + 0x20 * i).readU8();
                data.push(byte_data.toString(16).padStart(2, '0'));
            }
            console.log(data.join(" "));
        }
    }
}

let hook = new HOOK();
hook.readProcess();