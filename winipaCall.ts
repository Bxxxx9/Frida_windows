class CallWinApi {
    private processName = "winmine.exe";
    private Basemodule: Module;
    private height: number = 0;
    private width: number = 0;
    private mine_count: number = 0;
    private head: NativePointer = ptr(0);

    private hWnd: NativePointer = ptr(0);
    private GetClientRect!: NativePointer | null;
    private InvalidateRect!: NativePointer | null;
    private MessageBox!: NativePointer | null;
    constructor() {

        this.Basemodule = Process.getModuleByName(this.processName);
    }

    private readProcess() {
        this.height = this.Basemodule.base.add(0x5338).readU32();
        this.width = this.Basemodule.base.add(0x5334).readU32();
        this.mine_count = this.Basemodule.base.add(0x5330).readU32();
        this.head = this.Basemodule.base.add(0x5340);
        this.hWnd = this.Basemodule.base.add(0x5B24).readPointer();

        this.GetClientRect = Module.findExportByName("User32.dll", "GetClientRect");
        this.InvalidateRect = Module.findExportByName("User32.dll", "InvalidateRect");

    }

    board_info() {
        this.WriteProcess();
    }
    WriteProcess(modify: boolean = false) {

        this.readProcess();

        for (let i = 0; i < this.height + 2; i++) {

            let data = [];
            for (let j = 0; j < this.width + 2; j++) {
                let byte_data = this.head.add(j + 0x20 * i).readU8();
                if (modify == true) {
                    if (byte_data == 0x8F) {
                        this.head.add(j + 0x20 * i).writeU8(0x8E);
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

    winApicall() {

        // BOOL GetClientRect(
        //     [in]  HWND   hWnd,
        //     [out] LPRECT lpRect
        // );

        const lpRect = Memory.alloc(4 * 4);
        let GetClientRect = new NativeFunction(this.GetClientRect!, "bool", ["pointer", "pointer"]);
        GetClientRect(this.hWnd, lpRect);

        // BOOL InvalidateRect(
        //     [in] HWND       hWnd,
        //     [in] const RECT * lpRect,
        //     [in] BOOL       bErase
        // );        
        let InvalidateRect = new NativeFunction(this.InvalidateRect!, "bool", ["pointer", "pointer", 'bool']);
        InvalidateRect(this.hWnd, lpRect, 1);
    }
}

let callwin = new CallWinApi();
callwin.WriteProcess(true);
callwin.board_info();
callwin.winApicall();