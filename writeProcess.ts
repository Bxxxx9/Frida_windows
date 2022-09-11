class writehook {
    private processName = "winmine.exe";
    private Basemodule: Module;
    private height: number = 0;
    private width: number = 0;
    private mine_count: number = 0;
    private head: NativePointer = ptr(0);
    constructor() {
        console.log("======================", new Date().toISOString(), "==========================");
        console.log("Frida.version", Frida.version);

        this.Basemodule = Process.getModuleByName(this.processName);
    }

    private ReadProcessMemory() {
        this.height = this.Basemodule.base.add(0x5338).readU32();
        this.width = this.Basemodule.base.add(0x5334).readU32();
        this.mine_count = this.Basemodule.base.add(0x5330).readU32();
        this.head = this.Basemodule.base.add(0x5340);
    }

    board_info() {
        this.WriteProcess();
    }
    WriteProcess(modify: boolean = false) {

        this.ReadProcessMemory();

        for (let i = 0; i < this.height + 2; i++) {

            let data = [];
            for (let j = 0; j < this.width + 2; j++) {
                let byte_data = this.head.add(j + 0x20 * i).readU8();
                if (modify == true) {
                    if (byte_data == 0x8F) {
                        this.head.add(j + 0x20 * i).writeU8(0x8E); // WriteProcessMemory
                    }
                }
                else {
                    data.push(byte_data.toString(16).padStart(2, '0').toUpperCase());
                }
            }

            if (modify != true) {
                console.log(data.join(" "));
            }
        }
    }
}

let writeh = new writehook();
writeh.WriteProcess(true);
writeh.board_info();