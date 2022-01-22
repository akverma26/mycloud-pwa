const showLoader = (parentElement = ".main") => {
    let parentElementPositionStyle = $(parentElement).css("position");
    if (
        parentElementPositionStyle != "relative" &&
        parentElementPositionStyle != "fixed" &&
        parentElementPositionStyle != "absolute"
    ) {
        $(parentElement).css("position", "relative");
        $(parentElement).attr(
            "initialPositionValue",
            parentElementPositionStyle
        );
    }
    $(parentElement).append(`
        <div class="loading-container" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;">

            <style>
            @keyframes lds-ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }            
            </style>

            <div class="lds-ring" style="display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;">

                <div style="box-sizing: border-box;
                display: block;
                position: absolute;
                width: 50px;
                height: 50px;
                margin: 5px;
                border: 5px solid rgb(121, 121, 121);
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: rgb(121, 121, 121) transparent transparent transparent;
                animation-delay: 0s;"></div>

                <div style="box-sizing: border-box;
                display: block;
                position: absolute;
                width: 50px;
                height: 50px;
                margin: 5px;
                border: 5px solid rgb(121, 121, 121);
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: rgb(121, 121, 121) transparent transparent transparent;
                animation-delay: -0.45s;"></div>

                <div style="box-sizing: border-box;
                display: block;
                position: absolute;
                width: 50px;
                height: 50px;
                margin: 5px;
                border: 5px solid rgb(121, 121, 121);
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: rgb(121, 121, 121) transparent transparent transparent;
                animation-delay: -0.3s;"></div>

                <div style="box-sizing: border-box;
                display: block;
                position: absolute;
                width: 50px;
                height: 50px;
                margin: 5px;
                border: 5px solid rgb(121, 121, 121);
                border-radius: 50%;
                animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                border-color: rgb(121, 121, 121) transparent transparent transparent;
                animation-delay: -0.15s;"></div>

            </div>
        </div>
    `);
};

const hideLoader = (parentElement = ".main") => {
    $(parentElement).find(".loading-container").remove();
    $(parentElement).css(
        "position",
        $(parentElement).attr("initialPositionValue")
    );
};
