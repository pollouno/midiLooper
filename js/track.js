function Track(looper) {
    const MAX_TRACK_LENGTH   = 64;
    const MEASURE_LENGTH = 8;

    this.looper = looper;
    this.time = 0;
    
    this.quantize = 4;  // => 1/x
    this.trackLength = MAX_TRACK_LENGTH / MEASURE_LENGTH;
    this.messages = [];
    this.trackPointer = 0;
    this.OnTick = (delta) => {
        let t = this.time;
        this.time = (t + delta) % (this.trackLength * MEASURE_LENGTH);
        if(this.time < t)
            messages.forEach(msg => { msg.played = false; });

        this.CheckNextMessage();
    };
    this.ExecuteNextMessage = () => {
        this.looper.ExecuteMessage(this.messages[this.trackPointer]);
        this.messages[this.trackPointer].played = true;
        this.trackPointer = (this.trackPointer + 1) % this.messages.length;

        this.CheckNextMessage();
    };
    this.CheckNextMessage = () => {
        let msg = this.messages[this.trackPointer];
        if(msg.time <= this.time && !msg.played)
            this.ExecuteNextMessage();
    };
    this.RecordMessage = (msg) => {
        this.messages.splice(this.trackPointer + 1, 0, {
            time : this.quantize == 0 ? this.time : Quantize(this.time, 1/this.quantize),
            message : msg,
            played : true
        });
    };
    this.SetTrackLength = () => { this.trackLength = MEASURE_LENGTH * Math.ceil(this.time / MEASURE_LENGTH); }
    this.ClearBeat = () => {
        
    };
    this.ClearAll = () => {
        
    };
}

function Quantize(n, x)
{
    if(x/2>n)
       return 0;
    else if(x>n)
        return x;
 
    n = n + x/2;
    n = n - (n%x);
    return n;
}

export { Track };