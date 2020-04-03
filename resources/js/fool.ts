import {Terminal} from "xterm";
import {eraseScreen, cursorLeft, cursorTo} from "ansi-escapes";

let initialized = false;

function runFakeTerminal(term: Terminal) {
    if (initialized) return;

    term.write(eraseScreen + cursorLeft);

    term.writeln('Welcome to Ubuntu 16.04.6 LTS (GNU/Linux 4.4.0-143-generic x86_64)');
    term.writeln('');
    term.writeln(' * Documentation:  https://help.ubuntu.com');
    term.writeln(' * Management:     https://landscape.canonical.com');
    term.writeln(' * Support:        https://ubuntu.com/advantage');
    term.writeln('');
    term.writeln(' * Kubernetes 1.18 GA is now available! See https://microk8s.io for docs or');
    term.writeln('   install it with:');
    term.writeln('');
    term.writeln('     sudo snap install microk8s --channel=1.18 --classic');
    term.writeln('');
    term.writeln(' * Multipass 1.1 adds proxy support for developers behind enterprise');
    term.writeln('   firewalls. Rapid prototyping for cloud operations just got easier.');
    term.writeln('');
    term.writeln('     https://multipass.run/');
    term.writeln('');
    term.writeln(' * Canonical Livepatch is available for installation.');
    term.writeln('   - Reduce system reboots and improve kernel security. Activate at:');
    term.writeln('     https://ubuntu.com/livepatch');
    term.writeln('New release \'18.04.4 LTS\' available.');
    term.writeln('Run \'do-release-upgrade\' to upgrade to it.');
    term.writeln('');
    term.writeln('');
    term.writeln('Welcome to Alibaba Cloud Elastic Compute Service !');
    prompt(term);

    term.onKey(e => {
        const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

        if (e.domEvent.code === "Enter" || e.domEvent.code === "NumpadEnter") {
            term.write("\r\nHappy April Fools' Day~");
            prompt(term);
        } else if (e.domEvent.code === "Backspace") {
            if (term.buffer.cursorX > 26) term.write('\b \b');
        } else if (printable) term.write(e.key);
    });

    initialized = true;
}

function prompt(term) {
    term.write('\r\nroot@ZHC-Ubuntu-Server:~# ');
}

export function fool(term: Terminal) {
    term.write(eraseScreen + cursorLeft);
    term.write(cursorTo(0, 0) + "Fetching your SSH keys...");
    window.setTimeout(function() {
        term.write(cursorTo(0, 1) + "Trying to start SSH connection...");
        window.setTimeout(runFakeTerminal, 3000, term);
    }, 500);
}
