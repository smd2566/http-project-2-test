const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleSword = (e, onSwordAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#swordName').value;
    const sharpness = e.target.querySelector('#swordSharpness').value;
    const level = e.target.querySelector('#swordLevel').value;
    const enchantment = e.target.querySelector('#swordEnchantment').value;

    if (!name || !sharpness || !level || !enchantment) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, sharpness, level, enchantment}, onSwordAdded);
    return false;
}

const SwordForm = (props) => {
    return(
        <form id="swordForm"
            onSubmit={(e) => handleSword(e, props.triggerReload)}
            name="swordForm"
            action="/maker"
            method="POST"
            className="swordForm"
        >
            <label id = "swordNameLabel" htmlFor="name">Name: </label>
            <input id="swordName" type="text" name="name" placeHolder="Sword Name" />
            <label id = "swordSharpnessLabel" htmlFor="sharpness">Sharpness: </label>
            <input id="swordSharpness" type="number" min="0" name="sharpness" />
            <label id = "swordLevelLabel" htmlFor="level">Level: </label>
            <input id="swordLevel" type="number" min="0" name="level" />
            <label id = "swordEnchantmentLabel" htmlFor="enchantment">Enchantment: </label>
            <input id="swordEnchantment" type="text" name="enchantment" placeHolder="Sword Enchantment" />
            <input className="makeSwordSubmit" type="submit" value="Make Sword" />
            
        </form>
    );
};

const SwordList = (props) => {
    const [swords, setSwords] = useState(props.swords);

    useEffect(() => {
        const loadSwordsFromServer = async () => {
            const response = await fetch('/getSwords');
            const data = await response.json();
            setSwords(data.swords);
        };
        loadSwordsFromServer();
    }, [props.reloadSwords]);

    if (swords.length === 0) {
        return (
            <div className="swordList">
                <h3 className="emptySword">No Swords Yet!</h3>
            </div>
        );
    }

    const swordNodes = swords.map(sword => {
        return (
            <div key={sword.id} className="sword">
                <img src="/assets/img/swordface.jpeg" alt="sword face" className="swordFace" />
                <h3 className="swordName">Name: {sword.name}</h3>
                <h3 className="swordSharpness">Sharpness: {sword.sharpness}</h3>
                <h3 className="swordLevel">Level: {sword.level}</h3>
                <h3 className="swordEnchantment">Enchantment: {sword.enchantment}</h3>
            </div>
        );
    });

    return (
        <div className="swordList">
            {swordNodes}
        </div>
    );
};

const App = () => {
    const [reloadSwords, setReloadSwords] = useState(false);

    return (
        <div>
            <div id="makeSword">
                <SwordForm triggerReload={() => setReloadSwords(!reloadSwords)} />
            </div>
            <div id="swords">
                <SwordList swords={[]} reloadSwords={reloadSwords} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App />);
};

window.onload = init;