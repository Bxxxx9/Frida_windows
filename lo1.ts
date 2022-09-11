function frida01() {
    console.log("===============", new Date().toISOString(), "=================");
    console.log(Frida.version);
    console.log(Frida.heapSize);
    console.log(Process.id);
    console.log(Process.arch);
    console.log(Process.codeSigningPolicy);
   
    let modul = Process.enumerateModules();
    for (const item of modul) {
        console.log(item.base, item.name, item.size);
    }

}
frida01();
console.log("OK");